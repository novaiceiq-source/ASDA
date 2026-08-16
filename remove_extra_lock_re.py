import re

content = open('src/App.tsx').read()

pattern = re.compile(r"(\s*<button \s*onClick=\{\(\) => setReportsView\('change_pin'\)\}.*?</button>)", re.DOTALL)

# Let's see how many matches there are
matches = pattern.findall(content)
print(f"Found {len(matches)} matches")

if len(matches) > 1:
    # Remove the second match
    first_idx = content.find(matches[0])
    second_idx = content.find(matches[1], first_idx + len(matches[0]))
    
    if second_idx != -1:
        content = content[:second_idx] + content[second_idx + len(matches[1]):]
        open('src/App.tsx', 'w').write(content)
        print("Removed the second match.")
else:
    print("Not multiple matches found.")

