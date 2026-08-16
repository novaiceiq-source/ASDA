import re

content = open('src/App.tsx').read()

old_state = "const [reportsView, setReportsView] = useState<'menu' | 'shifts' | 'inventory_settings' | 'shift_details' | 'delegates_settings' | 'financial'>('menu');"
new_state = """const [reportsView, setReportsView] = useState<'menu' | 'shifts' | 'inventory_settings' | 'shift_details' | 'delegates_settings' | 'financial' | 'delegate_stats' | 'delegate_stats_detail'>('menu');
  const [statsDelegateId, setStatsDelegateId] = useState<string | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month'>('today');"""

content = content.replace(old_state, new_state)

open('src/App.tsx', 'w').write(content)
