print("Hello World")



import matplotlib.pyplot as plt
import numpy as np

n = 10
for j in range(n):
    for i in range(n):
        x = i + 0.5 * (j % 2)
        y = np.sqrt(3) / 2 * j
        color = np.random.rand(3,)
        plt.scatter(x, y, color=np.random.rand(3, ), s=500, marker='h')


plt.axis('equal')
plt.axis('off')
plt.show()

import turtle, colorsys
t = turtle.Turtle()
turtle.bgcolor('black')
t.speed(0)
colors = [colorsys.hsv_to_rgb(i/36,1,1) for i in range(36)]

for i in range(36):
    t.color(colors[i])
    t.circle(100)
    t.left(10)

turtle.done()

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

x = np.linspace(-5,5,50)
y = np.linspace(-5,5,50)
x, y = np.meshgrid(x,y)
z = np.sin(np.sqrt(x**2 + y**2))
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(x,y,z, cmap="viridis")
plt.show()