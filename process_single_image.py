from PIL import Image, ImageDraw
import os

image_path = r"C:\Users\Devendraprasad\.gemini\antigravity-ide\brain\10e9678b-4a92-4b27-9768-0cee959183ef\nika_cloud_1782836702373.png"
output_path = r"c:\Users\Devendraprasad\Downloads\One-Piece-main\One-Piece-main\public\images\products\nika-cloud-mini-sticker-sheet-1.png"

img = Image.open(image_path).convert("RGBA")

# Floodfill from edges to make background transparent
ImageDraw.floodfill(img, (0, 0), (0, 0, 0, 0), thresh=30)
ImageDraw.floodfill(img, (img.width-1, 0), (0, 0, 0, 0), thresh=30)
ImageDraw.floodfill(img, (0, img.height-1), (0, 0, 0, 0), thresh=30)
ImageDraw.floodfill(img, (img.width-1, img.height-1), (0, 0, 0, 0), thresh=30)

# Sometimes the studio background has a gradient, so we also floodfill slightly inward
ImageDraw.floodfill(img, (img.width//2, 5), (0, 0, 0, 0), thresh=30)

img.save(output_path)
print("Successfully processed and saved image.")
