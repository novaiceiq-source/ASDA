import re

content = open('src/App.tsx').read()

target = "هذا القسم خاص في الإدارة، يرجى إدخال الرمز السري للمتابعة. (الرمز: 1234)"
replacement = "هذا القسم خاص في الإدارة، يرجى إدخال الرمز السري للمتابعة."

if target in content:
    content = content.replace(target, replacement)
    open('src/App.tsx', 'w').write(content)
    print("Updated successfully")
else:
    print("Target not found")
