from PIL import Image

# Open the image
img = Image.open('public/images/products/custom-acrylics.jpg')
width, height = img.size

# Calculate width of each part
w_part = width // 3

# Crop left part (Gear 5 Reveal - 3001)
left = img.crop((0, 0, w_part, height))
left.save('public/images/products/3001-gear5.jpg')

# Crop middle part (Wanokuni Zoro - 3006)
middle = img.crop((w_part, 0, w_part * 2, height))
middle.save('public/images/products/3006-wanokuni.jpg')

# Crop right part (Haki Crackle Shanks - 3002)
right = img.crop((w_part * 2, 0, width, height))
right.save('public/images/products/3002-haki-crackle.jpg')

print("Cropped successfully!")
