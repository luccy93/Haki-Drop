import * as fs from 'fs';
import * as path from 'path';
import { HAKI_DROP_PRODUCTS } from './src/lib/mockData';

const products = HAKI_DROP_PRODUCTS.map(p => {
  const stock = p.variants ? p.variants.reduce((acc, v) => acc + (v.inventory || 0), 0) : 100;
  
  let categoryName = 'Tees';
  if (p.collection === 'hoodies') categoryName = 'Hoodies & Outerwear';
  if (p.collection === 'stickers') categoryName = 'Stickers & Decals';
  if (p.collection === 'cards') categoryName = 'Trading Cards';
  if (p.collection === 'toys') categoryName = 'Toys & Figures';
  
  return {
    id: p.id,
    name: p.title,
    handle: p.handle,
    description: p.description,
    price: p.price,
    stock: stock > 0 ? stock : 50,
    image_url: p.images[0],
    category: {
      name: categoryName,
      slug: p.collection
    },
    tags: ['NEW']
  };
});

const outputPath = path.join(__dirname, 'src', 'data', 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');

console.log(`Successfully wrote ${products.length} products to products.json`);
