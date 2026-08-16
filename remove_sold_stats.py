import re

content = open('src/App.tsx').read()

pattern = re.compile(r"\{\/\* Sold Items Stats \*\/\}.*?\{\/\* Expenses List \*\/\}", re.DOTALL)
content = pattern.sub("{/* Expenses List */}", content)

open('src/App.tsx', 'w').write(content)
print("Removed sold stats.")
