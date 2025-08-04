import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Set up the figure
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.suptitle("Orthographic Projections of Points A and B")

# Front View (Left Plot)
ax1.set_title("Front View (VP)")
ax1.set_xlabel("X (Distance from VP)")
ax1.set_ylabel("Y (Height from HP)")
ax1.grid(True)
ax1.set_xlim(-5, 35)
ax1.set_ylim(-20, 5)
ax1.axhline(0, color='black', linewidth=0.5)
ax1.axvline(0, color='black', linewidth=0.5)

# Top View (Right Plot)
ax2.set_title("Top View (HP)")
ax2.set_xlabel("X (Distance from VP)")
ax2.set_ylabel("Z (Depth)")
ax2.grid(True)
ax2.set_xlim(-5, 35)
ax2.set_ylim(-35, 5)
ax2.axhline(0, color='black', linewidth=0.5)
ax2.axvline(0, color='black', linewidth=0.5)

# Static points (A and B)
A_front = (30, 0)
B_front = (0, -17.32)  # d = 30 * tan(30°)
A_top = (30, 0)
B_top = (0, -30)  # z = -30 (since tan(45°) = 1)

# Plot static points
ax1.scatter(*A_front, color='green', s=50, label='A (30, 0)')
ax1.scatter(*B_front, color='purple', s=50, label='B (0, -17.32)')
ax2.scatter(*A_top, color='green', s=50, label='A (30, 0)')
ax2.scatter(*B_top, color='purple', s=50, label='B (0, -30)')

# Animated lines (initially empty)
front_line, = ax1.plot([], [], 'r-', label='Front View (30°)')
top_line, = ax2.plot([], [], 'b-', label='Top View (45°)')

# Animation function
def update(frame):
    # Gradually draw the lines from A to B
    frac = frame / 30  # 30 frames for smoothness
    
    # Front View Line (Red)
    x_front = [A_front[0], A_front[0] - frac * (A_front[0] - B_front[0])]
    y_front = [A_front[1], A_front[1] - frac * (A_front[1] - B_front[1])]
    front_line.set_data(x_front, y_front)
    
    # Top View Line (Blue)
    x_top = [A_top[0], A_top[0] - frac * (A_top[0] - B_top[0])]
    y_top = [A_top[1], A_top[1] - frac * (A_top[1] - B_top[1])]
    top_line.set_data(x_top, y_top)
    
    return front_line, top_line

# Create animation
ani = FuncAnimation(
    fig, 
    update, 
    frames=30, 
    interval=100,  # 100ms per frame
    blit=True,
    repeat=False
)

# Add legends
ax1.legend()
ax2.legend()

plt.tight_layout()
plt.show()