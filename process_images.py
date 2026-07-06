from PIL import Image
import os

images = [
    (r"C:\Users\Devendraprasad\.gemini\antigravity-ide\brain\da67d099-98b5-4b62-a5e6-aab17dd19a65\shirt_drums_1782743184132.png", "drums-of-liberation-oversized-tee-1.png"),
    (r"C:\Users\Devendraprasad\.gemini\antigravity-ide\brain\da67d099-98b5-4b62-a5e6-aab17dd19a65\shirt_sungod_1782743205325.png", "sun-god-sketch-tee-1.png"),
    (r"C:\Users\Devendraprasad\.gemini\antigravity-ide\brain\da67d099-98b5-4b62-a5e6-aab17dd19a65\shirt_haki_1782743215163.png", "haki-crackle-acid-wash-tee-1.png"),
    (r"C:\Users\Devendraprasad\.gemini\antigravity-ide\brain\da67d099-98b5-4b62-a5e6-aab17dd19a65\shirt_wanokuni_1782743226838.png", "wanokuni-typography-long-sleeve-1.png"),
]

output_dir = r"c:\Users\Devendraprasad\Downloads\One-Piece-main\One-Piece-main\public\images\products"
os.makedirs(output_dir, exist_ok=True)

def remove_black_background(image_path, output_path, threshold=20):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    # We want to keep some of the dark colors of the shirts, so we use a distance formula
    # instead of just black. Or we can just use a simple threshold.
    # To be safe and keep shadows, we can make pixels with low luminance transparent.
    # But wait, black shirts will disappear!
    # A better way is to use a floodfill from the edges, or just keep it as is if blending mode in CSS is used!
    
    # Actually, in ProductCard, we have `#0C0C0E` background. The generated images have a black background.
    # If we just leave them with the black background, and use mix-blend-screen or lighten on the images? No, the shirt is black.
    # We can just remove pure black (R < 15, G < 15, B < 15).
    # Since the prompt said "Pure solid black background", let's check the corners to find the exact background color and flood fill it to transparent.
    pass

for src, out_name in images:
    img = Image.open(src).convert("RGBA")
    
    # Find background color from top-left corner
    bg_color = img.getpixel((0, 0))
    
    # A simple threshold approach: if distance from bg_color < 30, make transparent
    data = img.getdata()
    new_data = []
    for item in data:
        dist = sum(abs(a - b) for a, b in zip(item[:3], bg_color[:3]))
        # We need to be careful not to make the black shirts transparent.
        # But wait! If the shirt is black, it WILL be made transparent.
        # Floodfill from edges is better.
        pass
    
    # Using floodfill:
    from PIL import ImageDraw
    ImageDraw.floodfill(img, (0, 0), (0, 0, 0, 0), thresh=20)
    ImageDraw.floodfill(img, (img.width-1, 0), (0, 0, 0, 0), thresh=20)
    ImageDraw.floodfill(img, (0, img.height-1), (0, 0, 0, 0), thresh=20)
    ImageDraw.floodfill(img, (img.width-1, img.height-1), (0, 0, 0, 0), thresh=20)
    
    img.save(os.path.join(output_dir, out_name))
    print(f"Saved {out_name}")
