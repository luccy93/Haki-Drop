import json
import os

products_file = r"c:\Users\Devendraprasad\Downloads\One-Piece-main\One-Piece-main\src\data\products.json"

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    name = p['name'].lower()
    
    slug = 'tees'
    cat_name = 'Tees'
    
    if 'hoodie' in name or 'jacket' in name or 'outerwear' in name or 'cloak' in name or 'cardigan' in name or 'anorak' in name or 'puffer' in name:
        slug = 'hoodies'
        cat_name = 'Hoodies & Outerwear'
    elif 'sticker' in name or 'decal' in name:
        slug = 'stickers'
        cat_name = 'Stickers & Decals'
    elif 'card' in name or 'print' in name or 'poster' in name or 'scroll' in name or 'holo' in name:
        slug = 'cards'
        cat_name = 'Trading Cards'
    elif 'toy' in name or 'figure' in name or 'figma' in name or 'nendoroid' in name or 'collectible' in name or 'plush' in name or 'replica' in name or 'lamp' in name or 'set' in name or 'spinner' in name or 'acrylic' in name or 'drum' in name or 'fruit' in name:
        slug = 'toys'
        cat_name = 'Toys & Figures'
    elif 'tee' in name or 'shirt' in name or 'long sleeve' in name:
        slug = 'tees'
        cat_name = 'Tees'
    
    # Assign category object to product
    p['category'] = {
        'name': cat_name,
        'slug': slug
    }

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print("Categorization complete.")
