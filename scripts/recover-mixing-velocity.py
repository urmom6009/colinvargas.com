"""Sample the two source MATLAB velocity renderings. Requires NumPy and FFmpeg.

python scripts/recover-mixing-velocity.py u_Film_128_FINAL.mp4 v_Film_128_FINAL.mp4

velocity.bin contains 151 frames of 12 rows × 16 columns of signed byte pairs.
Each pair represents (u, v) in physical axis directions, scaled by 1.5 / 127.
Rows run from the top of the image downward. The sample is at each tile center.
Magnitudes are approximate and limited to the visible colorbar range.
"""

import argparse
import subprocess
from pathlib import Path

import numpy as np


WIDTH, HEIGHT = 1120, 840
SOURCE_FRAMES, OUTPUT_FRAMES = 1564, 151
ROWS, COLS = 12, 16


def sample_component(source):
    # Same nearest-frame selection as the temperature movie, including both ends.
    select = f"eq(n,floor(selected_n*{SOURCE_FRAMES - 1}/{OUTPUT_FRAMES - 1}+0.5))"
    command = [
        "ffmpeg", "-v", "error", "-threads", "2", "-i", str(source),
        "-vf", f"select='{select}'", "-fps_mode", "passthrough",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-threads", "1", "-",
    ]

    # Both velocity plots and the temperature video have the same plot rectangle.
    xs = 134 + np.floor((np.arange(COLS) + 0.5) * 796 / COLS).astype(int)
    ys = 108 + np.floor((np.arange(ROWS) + 0.5) * 596 / ROWS).astype(int)
    # The colorbar has +1.5 at its top and -1.5 at its bottom. Read its interior,
    # avoiding the border at y=107,704 and the tick marks along its right edge.
    codes = np.arange(-127, 128)
    bar_rows = np.rint(np.linspace(703, 108, len(codes))).astype(int)
    result = np.empty((OUTPUT_FRAMES, ROWS, COLS), dtype=np.int8)
    errors = []
    label_mask = None
    with subprocess.Popen(command, stdout=subprocess.PIPE) as decoder:
        for i in range(OUTPUT_FRAMES):
            data = decoder.stdout.read(WIDTH * HEIGHT * 3)
            if len(data) != WIDTH * HEIGHT * 3:
                raise ValueError(f"{source}: missing selected frame {i}")
            frame = np.frombuffer(data, np.uint8).reshape(HEIGHT, WIDTH, 3)
            labels = frame[95:719, 989:1034, 1] < 80
            if label_mask is None:
                label_mask = labels
            elif np.count_nonzero(labels != label_mask) > 0.10 * label_mask.sum():
                raise ValueError(f"{source}: colorbar labels changed at selected frame {i}")
            palette = np.median(frame[bar_rows, 958:974], axis=1)
            # The small spatial median reduces isolated compression artifacts.
            neighbors = [
                frame[ys[:, None] + dy, xs + dx]
                for dy in (-1, 0, 1) for dx in (-1, 0, 1)
            ]
            samples = np.median(neighbors, axis=0)
            distances = np.square(samples[:, :, None, :] - palette).sum(axis=-1)
            nearest = distances.argmin(axis=-1)
            result[i] = codes[nearest]
            errors.extend(np.sqrt(distances.min(axis=-1)).ravel())
        if decoder.stdout.read(1) or decoder.wait():
            raise ValueError(f"{source}: unexpected FFmpeg output")
    print(f"{source.name}: 95th percentile RGB matching error {np.percentile(errors, 95):.2f}")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("u", type=Path)
    parser.add_argument("v", type=Path)
    parser.add_argument(
        "--output", type=Path,
        default=Path(__file__).resolve().parents[1] / "public/media/mixing-chamber/velocity.bin",
    )
    args = parser.parse_args()
    field = np.stack([sample_component(args.u), sample_component(args.v)], axis=-1)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(field.tobytes())
    print(f"Wrote {field.nbytes:,} bytes to {args.output}")


if __name__ == "__main__":
    main()
