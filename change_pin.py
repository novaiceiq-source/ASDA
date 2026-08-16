import re

content = open('src/App.tsx').read()

# 1. Update the state to include admin PIN and change PIN state
state_injection = """
  const [isReportsUnlocked, setIsReportsUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem('nova_admin_pin') || '1234');
  const [reportsPin, setReportsPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [reportsView, setReportsView] = useState<'menu' | 'shifts' | 'inventory_settings' | 'shift_details' | 'delegates_settings' | 'financial' | 'delegate_stats' | 'delegate_stats_detail' | 'change_pin'>('menu');
  const [changePinData, setChangePinData] = useState({ currentPin: '', newPin: '', confirmPin: '' });
"""
content = re.sub(r"  const \[isReportsUnlocked, setIsReportsUnlocked\] = useState\(false\);.*?(?=  const \[selectedShift, setSelectedShift\] = useState\(''\);)", state_injection, content, flags=re.DOTALL)

# 2. Update the handleUnlockReports
old_unlock = """  const handleUnlockReports = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportsPin === '1234') { // Admin PIN
      setIsReportsUnlocked(true);
      setPinError(false);
      setReportsPin('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
    }
  };"""

new_unlock = """  const handleUnlockReports = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportsPin === adminPin) {
      setIsReportsUnlocked(true);
      setPinError(false);
      setReportsPin('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePinData.currentPin !== adminPin) {
      showToast('الرمز الحالي غير صحيح', 'error');
      return;
    }
    if (changePinData.newPin !== changePinData.confirmPin) {
      showToast('الرمز الجديد غير متطابق', 'error');
      return;
    }
    if (changePinData.newPin.length < 4) {
      showToast('يجب أن يتكون الرمز من 4 أرقام على الأقل', 'error');
      return;
    }
    setAdminPin(changePinData.newPin);
    localStorage.setItem('nova_admin_pin', changePinData.newPin);
    showToast('تم تغيير رمز الدخول بنجاح!', 'success');
    setChangePinData({ currentPin: '', newPin: '', confirmPin: '' });
    setReportsView('menu');
  };
"""
content = content.replace(old_unlock, new_unlock)

# 3. Add button to Admin Menu
menu_button_pattern = re.compile(r"(<button \s*onClick=\{\(\) => setReportsView\('delegate_stats'\)\}.*?</button>)", re.DOTALL)
new_menu_buttons = """\\1
                     
                     <button 
                       onClick={() => setReportsView('change_pin')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform col-span-2"
                     >
                       <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/40 flex items-center justify-center text-orange-500 shadow-inner">
                         <Lock className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">تغيير رمز الدخول</span>
                     </button>"""
content = menu_button_pattern.sub(new_menu_buttons, content)


# 4. Add the change_pin view
view_target = """) : reportsView === 'delegates_settings' ? ("""

change_pin_view = """) : reportsView === 'change_pin' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Lock className="w-6 h-6 text-orange-500" />
                      تغيير رمز الدخول
                    </h2>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleChangePin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">الرمز الحالي</label>
                        <input 
                          type="password"
                          inputMode="numeric"
                          required
                          value={changePinData.currentPin}
                          onChange={(e) => setChangePinData({...changePinData, currentPin: e.target.value})}
                          placeholder="••••"
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-slate-800 dark:text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">الرمز الجديد</label>
                        <input 
                          type="password"
                          inputMode="numeric"
                          required
                          value={changePinData.newPin}
                          onChange={(e) => setChangePinData({...changePinData, newPin: e.target.value})}
                          placeholder="••••"
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-slate-800 dark:text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">تأكيد الرمز الجديد</label>
                        <input 
                          type="password"
                          inputMode="numeric"
                          required
                          value={changePinData.confirmPin}
                          onChange={(e) => setChangePinData({...changePinData, confirmPin: e.target.value})}
                          placeholder="••••"
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-slate-800 dark:text-slate-100 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg active:scale-95 transition-all shadow-md shadow-orange-500/20"
                      >
                        <Save className="w-5 h-5" />
                        حفظ الرمز الجديد
                      </button>
                    </form>
                  </div>
                </div>
              ) : reportsView === 'delegates_settings' ? ("""
content = content.replace(view_target, change_pin_view)

open('src/App.tsx', 'w').write(content)
print("Updated successfully")
