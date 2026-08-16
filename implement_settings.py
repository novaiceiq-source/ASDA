import re

content = open('src/App.tsx').read()

# 1. Add lucide icons if needed
if 'Camera' not in content:
    content = content.replace("from 'lucide-react';", "Camera, Image as ImageIcon, from 'lucide-react';")

# 2. Add state for logoUrl
state_injection = """
  const [activeTab, setActiveTab] = useState('inventory');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => localStorage.getItem('nova_logo'));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setLogoUrl(url);
        localStorage.setItem('nova_logo', url);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
"""
content = content.replace("  const [activeTab, setActiveTab] = useState('inventory');\n  const [isDarkMode, setIsDarkMode] = useState(false);", state_injection.strip('\n'))

# 3. Modify the header
# Current header code:
#       {/* Header */}
#       <header className="relative z-10 pt-12 pb-6 px-6 bg-gradient-to-b from-blue-50/90 dark:from-slate-950/90 to-transparent backdrop-blur-md transition-colors duration-300">
#         <div className="flex items-center gap-3 mb-2">
#           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-3d-button flex items-center justify-center text-white shrink-0">
#             <Droplets className="w-7 h-7 drop-shadow-md" />
#           </div>
#           <div>
#             <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight text-shadow-sm transition-colors duration-300">شركة نوڤا</h1>
#             <p className="text-sm font-semibold text-blue-600/80 dark:text-blue-400/80 transition-colors duration-300">لإنتاج الثلج البلوري</p>
#           </div>
#           <button 
#             onClick={() => setIsDarkMode(!isDarkMode)}
#             className="p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-3d-input text-blue-600 dark:text-blue-400 mr-auto transition-all active:scale-95"
#             aria-label="تبديل الوضع الليلي"
#           >
#             {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
#           </button>
#         </div>
#       </header>

header_regex = re.compile(r"\{\/\* Header \*\/\}.*?</header>", re.DOTALL)
new_header = """{/* Header */}
      <header className="relative z-10 pt-12 pb-6 px-6 bg-gradient-to-b from-blue-50/90 dark:from-slate-950/90 to-transparent backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-3 mb-2">
          {logoUrl ? (
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 dark:border-slate-700">
              <img src={logoUrl} alt="شعار الشركة" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-3d-button flex items-center justify-center text-white shrink-0">
              <Droplets className="w-8 h-8 drop-shadow-md" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight text-shadow-sm transition-colors duration-300">شركة نوڤا</h1>
            <p className="text-sm font-semibold text-blue-600/80 dark:text-blue-400/80 transition-colors duration-300">لإنتاج الثلج البلوري</p>
          </div>
        </div>
      </header>"""
content = header_regex.sub(new_header, content)

# 4. Modify settings tab and 'add' tab
# Current 'settings', 'add' block:
#           {['settings', 'add'].includes(activeTab) && (
#             <motion.div
#               key={activeTab}
# ...

settings_block_pattern = re.compile(r"\{\[\'settings\', \'add\'\]\.includes\(activeTab\) && \(\n.*?<\/motion\.div>\n\s*\)\}", re.DOTALL)

new_settings_and_add = """{activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Settings className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  الإعدادات
                </h2>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 px-1">المظهر العام</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">الوضع الليلي</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تبديل واجهة التطبيق للون الداكن</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 bottom-1 w-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-1 left-0' : '-translate-x-1 right-0'}`}></div>
                  </button>
                </div>
              </div>

              {/* Company Profile Settings */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 px-1">إعدادات الشركة</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {logoUrl ? (
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0">
                        <img src={logoUrl} alt="الشعار الحالي" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2">صورة الشعار</div>
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 rounded-xl text-center text-xs font-bold transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                          رفع صورة
                        </label>
                        {logoUrl && (
                          <button 
                            onClick={() => { setLogoUrl(null); localStorage.removeItem('nova_logo'); }}
                            className="p-2 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center pt-24 pb-12 h-full text-center px-4"
            >
              <div className="w-28 h-28 mb-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),_0_15px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),_0_15px_30px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center text-blue-500 relative">
                <div className="absolute inset-0 rounded-full border-4 border-white/50 dark:border-slate-800/50"></div>
                <Clock className="w-12 h-12 drop-shadow-md animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 transition-colors duration-300">
                إضافة عنصر
                <br/>
                <span className="text-blue-600 dark:text-blue-400">قريباً.. قيد العمل</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed font-semibold transition-colors duration-300">
                هذه الواجهة قيد التطوير والبرمجة حالياً، سيتم إتاحتها في التحديثات القادمة للنظام.
              </p>
            </motion.div>
          )}"""

content = settings_block_pattern.sub(new_settings_and_add, content)

open('src/App.tsx', 'w').write(content)
print("Updated successfully")
