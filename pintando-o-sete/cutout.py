import numpy as np
from PIL import Image, ImageDraw, ImageFilter
im=Image.open('../images/1.webp').convert('RGB')
c=im.crop((700,452,1262,833))
S=3
c=c.resize((c.width*S,c.height*S),Image.LANCZOS)
a=np.asarray(c).astype(float)/255
hsv=np.asarray(c.convert('HSV')).astype(float)
h=hsv[...,0]*360/255; s=hsv[...,1]/255; v=hsv[...,2]/255
yel=(h>30)&(h<62)&(s>0.45)&(v>0.6)
pale=(s<0.22)&(v>0.82)
bg=yel|pale
m=Image.fromarray((bg*255).astype('uint8'))
# keep only background connected to top/left/right borders
ff=m.copy()
W,H=ff.size
for x in range(0,W,6):
    if ff.getpixel((x,0))==255: ImageDraw.floodfill(ff,(x,0),128)
for y in range(0,int(H*0.45),6):
    for x in (0,W-1):
        if ff.getpixel((x,y))==255: ImageDraw.floodfill(ff,(x,y),128)
f=np.asarray(ff)
fg=((f!=128)&~yel).astype('uint8')*255
al=Image.fromarray(fg).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.6))
out=c.filter(ImageFilter.UnsharpMask(radius=2,percent=70,threshold=2)).convert('RGBA'); out.putalpha(al)
out.save('meninas_cut.png'); print(out.size)
prev=Image.new('RGBA',out.size,(240,244,251,255)); prev.alpha_composite(out); prev.convert('RGB').resize((W//2,H//2)).save('cut_preview.jpg')
