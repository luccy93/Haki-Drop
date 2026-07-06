const fs = require('fs');
const html = fs.readFileSync('one-piece-gear5-reveal.html', 'utf8');
const bottomMatch = html.match(/bottom\.src='(data:image\/[^;]+;base64,[^']+)'/);
const topMatch = html.match(/top\.src='(data:image\/[^;]+;base64,[^']+)'/);

if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images', { recursive: true });
}

if (bottomMatch) {
  const base64Data = bottomMatch[1].replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('public/images/luffy-gear5.jpg', buffer);
  console.log('Extracted luffy-gear5.jpg');
}

if (topMatch) {
  const base64Data = topMatch[1].replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('public/images/luffy-base.jpg', buffer);
  console.log('Extracted luffy-base.jpg');
}
