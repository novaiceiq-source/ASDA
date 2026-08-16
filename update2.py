content = open('src/App.tsx').read()
target = """              <button 
                onClick={() => setDelegateModal({ isOpen: true, id: '', name: '', whatsapp: '' })}
                className="w-full relative overflow-hidden group rounded-2xl p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-3d-button active:shadow-3d-button-active active:translate-y-px transition-all duration-200 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <UserPlus className="w-6 h-6 drop-shadow-md" />
                <span className="font-bold text-lg drop-shadow-md">إضافة مندوب جديد</span>
              </button>"""

content = content.replace(target, "")
open('src/App.tsx', 'w').write(content)
