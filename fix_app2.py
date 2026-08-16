with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = lines[:438] + lines[448:]
with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
