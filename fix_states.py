import re

content = open('src/App.tsx').read()

target = "const [changePinData, setChangePinData] = useState({ currentPin: '', newPin: '', confirmPin: '' });"
replacement = """const [changePinData, setChangePinData] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [statsDelegateId, setStatsDelegateId] = useState<string | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month'>('today');"""

content = content.replace(target, replacement)
open('src/App.tsx', 'w').write(content)
