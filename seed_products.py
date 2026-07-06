import os
import json
import random
import re

images_dir = r"c:\Users\Devendraprasad\Downloads\One-Piece-main\One-Piece-main\public\images\products"
products_file = r"c:\Users\Devendraprasad\Downloads\One-Piece-main\One-Piece-main\src\data\products.json"

if not os.path.exists(images_dir):
    print("Images directory not found")
    exit(1)

valid_extensions = {".jpg", ".jpeg", ".png", ".webp"}

def format_name(filename):
    name = os.path.splitext(filename)[0]
    name = re.sub(r'[-_]', ' ', name)
    return name.title()

products = []
if os.path.exists(products_file):
    try:
        with open(products_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except:
        products = []

existing_images = {p.get("image_url") for p in products}

for idx, filename in enumerate(sorted(os.listdir(images_dir))):
    ext = os.path.splitext(filename)[1].lower()
    if ext in valid_extensions:
        image_url = f"/images/products/{filename}"
        if image_url not in existing_images:
            products.append({
                "id": f"prd-auto-{1000 + idx}",
                "name": format_name(filename),
                "description": "High quality premium One Piece merchandise. Perfect for any fan of the series.",
                "price": random.choice([2500, 3000, 4500, 5000, 7500, 10000]),
                "stock": random.randint(10, 100),
                "image_url": image_url
            })

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print(f"Successfully added products. Total products now: {len(products)}")
