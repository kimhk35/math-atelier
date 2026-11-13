"""Render exact mathematical menu loops and reduced-motion posters with Pillow."""
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import math, random
OUT=Path(__file__).resolve().parents[1]/'assets/course-motion'
OUT.mkdir(parents=True,exist_ok=True)
S=3; N=144; SIZE=N*S
TEAL=(83,210,196); GOLD=(239,190,111); BLUE=(133,162,249)
def base():
 im=Image.new('RGB',(SIZE,SIZE));p=im.load()
 for y in range(SIZE):
  for x in range(SIZE):
   glow=max(0,1-math.hypot(x/S-74,y/S-59)/105)
   p[x,y]=(int(10+6*glow),int(22+14*glow),int(41+17*glow))
 return im
BG=base()
def line(d,pts,c,w=1):d.line([(x*S,y*S) for x,y in pts],fill=c,width=max(1,int(w*S)),joint='curve')
def poly(d,pts,c,edge):
 pts=[(x*S,y*S) for x,y in pts];d.polygon(pts,fill=c);d.line(pts+[pts[0]],fill=edge,width=2,joint='curve')
def arrow(d,a,b,c):
 line(d,[a,b],c,2);t=math.atan2(b[1]-a[1],b[0]-a[0]);r=6
 line(d,[(b[0]-r*math.cos(t-.5),b[1]-r*math.sin(t-.5)),b,(b[0]-r*math.cos(t+.5),b[1]-r*math.sin(t+.5))],c,1.7)
def finish(im):return im.resize((N,N),Image.Resampling.LANCZOS)
def advanced(t):
 im=BG.copy();d=ImageDraw.Draw(im);theta=2*math.pi*t;shear=.65*math.sin(theta);stretch=1+.28*math.cos(theta)
 def pos(x,y):return (72+31*(stretch*x+shear*y),77-31*y/stretch)
 for i in range(-2,3):
  line(d,[(12,77+26*i),(132,77+26*i)],(30,48,68),.6);line(d,[(72+26*i,16),(72+26*i,133)],(30,48,68),.6)
 line(d,[(12,77),(132,77)],(92,111,137),.8);line(d,[(72,15),(72,132)],(92,111,137),.8)
 pts=[pos(math.cos(k*math.pi/48),math.sin(k*math.pi/48)) for k in range(97)]
 line(d,pts,TEAL,1.5)
 square=[pos(0,0),pos(1,0),pos(1,1),pos(0,1)]
 layer=Image.new('RGBA',im.size);ld=ImageDraw.Draw(layer);ld.polygon([(x*S,y*S) for x,y in square],fill=(*TEAL,35));im=Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB');d=ImageDraw.Draw(im)
 line(d,square+[square[0]],TEAL,1.3);arrow(d,pos(0,0),pos(1,0),TEAL);arrow(d,pos(0,0),pos(0,1),GOLD)
 p=pos(math.cos(theta),math.sin(theta));d.ellipse(((p[0]-3)*S,(p[1]-3)*S,(p[0]+3)*S,(p[1]+3)*S),fill=GOLD)
 # Small determinant-preserving transform symbol gives a readable mathematical cue.
 line(d,[(17,28),(14,28),(14,16),(17,16)],BLUE,1);line(d,[(35,16),(38,16),(38,28),(35,28)],BLUE,1)
 for x,y in [(22,19),(31,19),(22,25),(31,25)]:d.ellipse(((x-1)*S,(y-1)*S,(x+1)*S,(y+1)*S),fill=TEAL)
 return finish(im)
random.seed(26);fiber=[(random.uniform(-1,1),random.uniform(-1,1),random.uniform(.012,.035)) for _ in range(420)]
def paper(t):
 # A full 180 degree fold about y=0 and its exact reverse. Endpoints ease to rest.
 phase=(1-math.cos(2*math.pi*t))/2;ang=math.pi*phase
 im=BG.copy();d=ImageDraw.Draw(im)
 def proj(x,y,z=0):
  u=.94*x-.34*y;v=.34*x+.94*y
  return (72+39*u,88-27*v-37*z)
 for i in range(-3,4):
  line(d,[proj(i*.5,-1.7),proj(i*.5,1.7)],(28,47,67),.6);line(d,[proj(-1.7,i*.5),proj(1.7,i*.5)],(28,47,67),.6)
 shadow=Image.new('RGBA',im.size);sd=ImageDraw.Draw(shadow);sd.polygon([(x*S,(y+5)*S) for x,y in [proj(-1,-1),proj(1,-1),proj(1,1),proj(-1,1)]],fill=(0,0,0,135));im=Image.alpha_composite(im.convert('RGBA'),shadow.filter(ImageFilter.GaussianBlur(5*S))).convert('RGB');d=ImageDraw.Draw(im)
 def fold(x,y):return proj(x,y*math.cos(ang),y*math.sin(ang)) if y>0 else proj(x,y)
 poly(d,[proj(-1,-1),proj(1,-1),proj(1,0),proj(-1,0)],(222,207,168),(251,232,189))
 shade=.80+.20*abs(math.cos(ang));col=tuple(int(v*shade) for v in ((240,222,179) if ang<math.pi/2 else (98,187,178)))
 poly(d,[fold(-1,0),fold(1,0),fold(1,1),fold(-1,1)],col,(249,230,187) if ang<math.pi/2 else (151,229,212))
 for x,y,l in fiber:
  a=fold(x,y);b=fold(min(1,x+l),y);c=(166,154,124) if y<=0 or ang<math.pi/2 else (73,145,138);line(d,[a,b],c,.23)
 line(d,[proj(-1,0),proj(1,0)],(184,140,76),.75)
 return finish(im)
for code,fn,count in [(18,advanced,48),(19,paper,60)]:
 frames=[fn(i/count) for i in range(count)]
 # A shared palette prevents color shimmer between frames.
 atlas=Image.new('RGB',(N*8,N*8))
 for i,frame in enumerate(frames):atlas.paste(frame,((i%8)*N,(i//8)*N))
 palette=atlas.quantize(colors=96,method=Image.Quantize.MEDIANCUT)
 quant=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in frames]
 quant[0].save(OUT/f'c{code}.gif',save_all=True,append_images=quant[1:],duration=90 if code==18 else 80,loop=0,optimize=True,disposal=1)
 frames[count//4].save(OUT/f'c{code}.png',optimize=True)
 with Image.open(OUT/f'c{code}.gif') as check:
  assert check.n_frames==count and check.info['loop']==0
  print(f'c{code}: {count} frames / {(OUT/f"c{code}.gif").stat().st_size} bytes')
