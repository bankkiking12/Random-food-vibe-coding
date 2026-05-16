import { useState, useEffect, useRef } from "react"

const menus = {
  "อาหารตามสั่ง": ["ข้าวผัดกะเพราหมูสับ","ข้าวผัดกะเพราไก่ไข่ดาว","ข้าวผัดกะเพราทะเล","ผัดคะน้าหมูกรอบ","ข้าวมันไก่","ข้าวหมูแดง","ข้าวหน้าเป็ด","ข้าวผัดหมู","ข้าวผัดกุ้ง","ไข่เจียวหมูสับ","ข้าวผัดปู","ผัดซีอิ๊วหมู","ต้มยำกุ้ง","ต้มข่าไก่","แกงเขียวหวานไก่","แกงมัสมั่นเนื้อ","ผัดเปรี้ยวหวานหมู","หมูทอดกระเทียม"],
  "ก๋วยเตี๋ยว": ["ก๋วยเตี๋ยวหมูน้ำใส","ก๋วยเตี๋ยวเนื้อน้ำตก","เย็นตาโฟ","บะหมี่หมูแดง","ก๋วยเตี๋ยวไก่","บะหมี่น้ำเนื้อตุ๋น","ผัดซีอิ๊วเส้นใหญ่","ผัดไทยกุ้งสด","ผัดไทยไข่","ก๋วยเตี๋ยวแห้งหมู","เส้นใหญ่ผัดขลุกขลิก","หมี่กรอบ","ก๋วยเตี๋ยวทะเล","บะหมี่แห้งหมูกรอบ","ก๋วยเตี๋ยวต้มยำ","ขนมจีนน้ำยา"],
  "อาหารอีสาน": ["ส้มตำไทย","ส้มตำปูปลาร้า","ลาบหมู","ลาบไก่","น้ำตกเนื้อ","ก้อยกุ้ง","ไก่ย่าง","หมูย่าง","ซุปหน่อไม้","ต้มแซ่บซี่โครงหมู","ลาบเป็ด","ส้มตำถั่วฝักยาว","แอ๊บปลา","คั่วกลิ้งหมู"],
  "อาหารญี่ปุ่น": ["ราเมนโชยุ","ราเมนมิโสะ","ราเมนทงคัตสึ","โดนบุริไก่ทอด","คาตสึดอน","ทาโกยากิ","โอโคโนมิยากิ","เทมปุระกุ้ง","อุด้งน้ำ","โซบะเย็น","ยากิโซบะ","ชาบูชาบู","ยากินิกุ","ซาชิมิรวม"],
  "สเต็ก / เวสเทิร์น": ["สเต็กเนื้อซอสพริกไทยดำ","สเต็กหมูซอสมัสตาร์ด","สเต็กไก่ซอสเห็ด","ปลาแซลมอนย่าง","พาสต้าคาร์โบนาร่า","พาสต้าโบโลเนส","พาสต้าซีฟู้ด","พิซซ่าฮาวาย","เบอร์เกอร์เนื้อ","เบอร์เกอร์ไก่","ริบอายสเต็ก","ซาลาด Caesar"],
  "อาหารจีน / ติ่มซำ": ["ข้าวมันไก่ฮ่องกง","หมูแดงย่าง","เป็ดปักกิ่ง","กุยช่ายทอด","ซาลาเปาหมูแดง","ขนมจีบ","ฮะเก๋า","หม่าล่า","ข้าวผัดหยางโจว","เกี๊ยวน้ำ","ผักบุ้งไฟแดง","ปลานึ่งซีอิ๊ว"],
  "อาหารเกาหลี": ["บิบิมบับ","ซุนดูบูจิเก","คิมจิจิเก","ทตบกกี","จาจังมยอน","ซัมกยอบซัล","คัลบี้ย่าง","บูลโกกิ","ไก่ทอดเกาหลี","กิมบับ"],
  "ฟาสต์ฟู้ด / จานด่วน": ["ไก่ทอด","เฟรนช์ฟรายส์","นักเก็ตไก่","ฮอทดอก","ต้มยำกุ้งมาม่า","มาม่าผัด","ข้าวต้มหมู","โจ๊กหมูสับ","ขนมปังไข่ดาวหมูยอ"],
}

const icons = {
  "อาหารตามสั่ง":"🍳","ก๋วยเตี๋ยว":"🍜","อาหารอีสาน":"🌶️",
  "อาหารญี่ปุ่น":"🍱","สเต็ก / เวสเทิร์น":"🥩",
  "อาหารจีน / ติ่มซำ":"🥟","อาหารเกาหลี":"🫕","ฟาสต์ฟู้ด / จานด่วน":"🍔",
}

const STORAGE_HISTORY = "foodapp_history"
const STORAGE_BLACKLIST = "foodapp_blacklist"
const STORAGE_CUSTOM = "foodapp_custom"
const STORAGE_COUNT = "foodapp_count"
const STORAGE_COUNT_DATE = "foodapp_count_date"

function playTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.frequency.value = 440 + Math.random() * 300
    g.gain.setValueAtTime(0.08, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    o.start(); o.stop(ctx.currentTime + 0.08)
  } catch {}
}

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = freq; o.type = "sine"
      const t = ctx.currentTime + i * 0.12
      g.gain.setValueAtTime(0.15, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      o.start(t); o.stop(t + 0.4)
    })
  } catch {}
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const allCats = Object.keys(menus)
  const [selected, setSelected] = useState(new Set(allCats))
  const [result, setResult] = useState(null)
  const [multiResults, setMultiResults] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]"))
  const [blacklist, setBlacklist] = useState(() => new Set(JSON.parse(localStorage.getItem(STORAGE_BLACKLIST) || "[]")))
  const [customMenus, setCustomMenus] = useState(() => JSON.parse(localStorage.getItem(STORAGE_CUSTOM) || "{}"))
  const [particles, setParticles] = useState([])
  const [popKey, setPopKey] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [spinCount, setSpinCount] = useState(() => {
    const today = getTodayKey()
    const savedDate = localStorage.getItem(STORAGE_COUNT_DATE)
    if (savedDate === today) return parseInt(localStorage.getItem(STORAGE_COUNT) || "0")
    return 0
  })
  const [multiCount, setMultiCount] = useState(1)
  const [players, setPlayers] = useState([""])
  const [playerMode, setPlayerMode] = useState(false)
  const [playerResults, setPlayerResults] = useState([])
  const [newMenu, setNewMenu] = useState("")
  const [newMenuCat, setNewMenuCat] = useState(allCats[0])
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [timer, setTimer] = useState(null)
  const [timerActive, setTimerActive] = useState(false)
  const [timerCount, setTimerCount] = useState(10)
  const [shareMsg, setShareMsg] = useState("")
  const spinRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => { localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history)) }, [history])
  useEffect(() => { localStorage.setItem(STORAGE_BLACKLIST, JSON.stringify([...blacklist])) }, [blacklist])
  useEffect(() => { localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(customMenus)) }, [customMenus])
  useEffect(() => {
    localStorage.setItem(STORAGE_COUNT, spinCount.toString())
    localStorage.setItem(STORAGE_COUNT_DATE, getTodayKey())
  }, [spinCount])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const m = params.get("menu")
    if (m) {
      setResult({ food: decodeURIComponent(m), cat: "แชร์มา" })
      setGlowing(true)
    }
  }, [])

  const getAllMenus = () => {
    const combined = { ...menus }
    Object.entries(customMenus).forEach(([cat, items]) => {
      combined[cat] = [...(combined[cat] || []), ...items]
    })
    return combined
  }

  const getPool = () => {
    const all = getAllMenus()
    const pool = []
    selected.forEach(cat => (all[cat] || []).forEach(food => {
      if (!blacklist.has(food)) pool.push({ food, cat })
    }))
    return pool
  }

  const totalCount = getPool().length

  const toggleCat = (cat) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.size === allCats.length) return new Set([cat])
      if (next.has(cat) && next.size === 1) return prev
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const spawnParticles = () => {
    const colors = ["#EAB308","#FDE68A","#FCD34D","#FFFFFF","#F59E0B"]
    setParticles(Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: 20 + Math.random() * 60,
      size: 4 + Math.random() * 6,
    })))
    setTimeout(() => setParticles([]), 1000)
  }

  const startTimer = () => {
    if (timerActive) {
      clearInterval(timerRef.current)
      setTimerActive(false)
      setTimerCount(10)
      return
    }
    setTimerActive(true)
    setTimerCount(10)
    let count = 10
    timerRef.current = setInterval(() => {
      count--
      setTimerCount(count)
      if (count <= 0) {
        clearInterval(timerRef.current)
        setTimerActive(false)
        setTimerCount(10)
        spin()
      }
    }, 1000)
  }

  const doSpin = (pool, count) => {
    return new Promise(resolve => {
      let c = 0
      const total = 18
      const interval = setInterval(() => {
        const items = Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)])
        if (count === 1) setResult(items[0])
        else setMultiResults(items)
        playTick()
        c++
        if (c >= total) {
          clearInterval(interval)
          const finals = Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)])
          resolve(finals)
        }
      }, 75)
    })
  }

  const spin = async () => {
    if (spinRef.current) return
    const pool = getPool()
    if (!pool.length) return
    spinRef.current = true
    setSpinning(true)
    setGlowing(false)
    setShaking(true)
    setPlayerResults([])
    setTimeout(() => setShaking(false), 400)

    if (playerMode && players.filter(p => p.trim()).length > 0) {
      const names = players.filter(p => p.trim())
      const finals = await doSpin(pool, names.length)
      const paired = names.map((name, i) => ({ name, ...finals[i % finals.length] }))
      setPlayerResults(paired)
      setMultiResults([])
      setResult(null)
      paired.forEach(p => setHistory(prev => [{ food: p.food, cat: p.cat }, ...prev].slice(0, 12)))
    } else if (multiCount > 1) {
      const finals = await doSpin(pool, multiCount)
      setMultiResults(finals)
      setResult(null)
      finals.forEach(f => setHistory(prev => [{ food: f.food, cat: f.cat }, ...prev].slice(0, 12)))
    } else {
      const [final] = await doSpin(pool, 1)
      setResult(final)
      setMultiResults([])
      setHistory(prev => [{ food: final.food, cat: final.cat }, ...prev].slice(0, 12))
    }

    setSpinCount(prev => prev + 1)
    setSpinning(false)
    setGlowing(true)
    setPopKey(k => k + 1)
    spawnParticles()
    playDing()
    spinRef.current = false
  }

  const skipAndSpin = () => {
    if (spinRef.current) return
    const pool = getPool()
    if (!pool.length) return
    const filtered = result ? pool.filter(p => p.food !== result.food) : pool
    const final = filtered[Math.floor(Math.random() * filtered.length)]
    setResult(final)
    setHistory(prev => [{ food: final.food, cat: final.cat }, ...prev].slice(0, 12))
    setSpinCount(prev => prev + 1)
    setGlowing(true)
    setPopKey(k => k + 1)
    spawnParticles()
    playDing()
  }

  const addBlacklist = (food) => {
    setBlacklist(prev => new Set([...prev, food]))
    if (result?.food === food) setResult(null)
    setHistory(prev => prev.filter(h => h.food !== food))
  }

  const removeBlacklist = (food) => {
    setBlacklist(prev => { const n = new Set(prev); n.delete(food); return n })
  }

  const addCustomMenu = () => {
    if (!newMenu.trim()) return
    setCustomMenus(prev => ({
      ...prev,
      [newMenuCat]: [...(prev[newMenuCat] || []), newMenu.trim()]
    }))
    setNewMenu("")
  }

  const shareResult = () => {
    if (!result) return
    const url = `${window.location.origin}${window.location.pathname}?menu=${encodeURIComponent(result.food)}`
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg("คัดลอก URL แล้ว!")
      setTimeout(() => setShareMsg(""), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-12 flex flex-col items-center">

      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-yellow-500 text-xs tracking-[0.4em] uppercase mb-3">วันนี้กินอะไรดี</p>
        <h1 className="font-display text-5xl font-bold text-white tracking-tight">เมนูของวันนี้</h1>
        <div className="flex items-center gap-3 justify-center mt-4">
          <div className="h-px w-12 bg-yellow-500/50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
          <div className="h-px w-12 bg-yellow-500/50"></div>
        </div>
        <div className="flex gap-4 justify-center mt-3 text-sm text-neutral-500">
          <span>{totalCount} เมนู</span>
          <span>·</span>
          <span>สุ่มวันนี้ {spinCount} ครั้ง</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-2xl">
        <button onClick={() => setSelected(new Set(allCats))}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all ${selected.size === allCats.length ? "bg-yellow-500 text-black border-yellow-500 font-bold" : "border-neutral-700 text-neutral-400 hover:border-yellow-500 hover:text-yellow-400"}`}>
          ทั้งหมด
        </button>
        {allCats.map(cat => (
          <button key={cat} onClick={() => toggleCat(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${selected.has(cat) ? "bg-yellow-500 text-black border-yellow-500 font-bold" : "border-neutral-700 text-neutral-400 hover:border-yellow-500 hover:text-yellow-400"}`}>
            {icons[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap gap-3 justify-center mb-6 max-w-md w-full">
        <div className="flex items-center gap-2 border border-neutral-700 rounded-full px-4 py-1.5">
          <span className="text-neutral-400 text-sm">สุ่ม</span>
          <button onClick={() => setMultiCount(m => Math.max(1, m - 1))} className="text-yellow-500 w-5 text-center">-</button>
          <span className="text-white text-sm w-4 text-center">{multiCount}</span>
          <button onClick={() => setMultiCount(m => Math.min(6, m + 1))} className="text-yellow-500 w-5 text-center">+</button>
          <span className="text-neutral-400 text-sm">เมนู</span>
        </div>
        <button onClick={() => setPlayerMode(p => !p)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all ${playerMode ? "bg-yellow-500 text-black border-yellow-500 font-bold" : "border-neutral-700 text-neutral-400 hover:border-yellow-500 hover:text-yellow-400"}`}>
          👥 กินกับเพื่อน
        </button>
        <button onClick={startTimer}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all ${timerActive ? "bg-red-500/20 text-red-400 border-red-500" : "border-neutral-700 text-neutral-400 hover:border-yellow-500 hover:text-yellow-400"}`}>
          ⏱ {timerActive ? `${timerCount}วิ...` : "ตั้งเวลา 10วิ"}
        </button>
        <button onClick={() => setShowAddMenu(p => !p)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all ${showAddMenu ? "bg-yellow-500 text-black border-yellow-500 font-bold" : "border-neutral-700 text-neutral-400 hover:border-yellow-500 hover:text-yellow-400"}`}>
          + เพิ่มเมนู
        </button>
      </div>

      {/* Player Mode */}
      {playerMode && (
        <div className="w-full max-w-md mb-6 border border-neutral-800 rounded-2xl p-4 bg-neutral-900">
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-3">ใส่ชื่อคนที่จะกินด้วย</p>
          {players.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={p} onChange={e => setPlayers(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                placeholder={`คนที่ ${i + 1}`}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-yellow-500/50" />
              {players.length > 1 && (
                <button onClick={() => setPlayers(prev => prev.filter((_, j) => j !== i))}
                  className="text-neutral-600 hover:text-red-400 px-2">✕</button>
              )}
            </div>
          ))}
          {players.length < 6 && (
            <button onClick={() => setPlayers(prev => [...prev, ""])}
              className="text-yellow-600 text-sm hover:text-yellow-400 mt-1">+ เพิ่มคน</button>
          )}
        </div>
      )}

      {/* Add Menu */}
      {showAddMenu && (
        <div className="w-full max-w-md mb-6 border border-neutral-800 rounded-2xl p-4 bg-neutral-900">
          <p className="text-yellow-500 text-xs tracking-widest uppercase mb-3">เพิ่มเมนูของตัวเอง</p>
          <div className="flex gap-2 mb-2">
            <input value={newMenu} onChange={e => setNewMenu(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustomMenu()}
              placeholder="ชื่อเมนู"
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-yellow-500/50" />
            <select value={newMenuCat} onChange={e => setNewMenuCat(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white outline-none">
              {allCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={addCustomMenu}
            className="w-full mt-1 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-xl text-sm transition-all">
            เพิ่มเมนู
          </button>
          {Object.entries(customMenus).map(([cat, items]) => items.map((food, i) => (
            <div key={`${cat}-${i}`} className="flex justify-between items-center mt-2 text-sm text-neutral-500">
              <span>{food} <span className="text-neutral-700">· {cat}</span></span>
              <button onClick={() => setCustomMenus(prev => ({ ...prev, [cat]: prev[cat].filter(f => f !== food) }))}
                className="hover:text-red-400 ml-2">✕</button>
            </div>
          )))}
        </div>
      )}

      {/* Result Card */}
      <div className="w-full max-w-md mb-4 relative">
        <div className={`border rounded-2xl bg-neutral-900 p-8 text-center min-h-48 flex flex-col items-center justify-center gap-3 transition-all duration-500 ${glowing && !spinning ? "border-yellow-500/60 glow-active" : "border-yellow-500/20"}`}>
          {particles.map(p => (
            <div key={p.id} className="particle absolute pointer-events-none"
              style={{ left: `${p.x}%`, bottom: "50%", width: p.size, height: p.size, borderRadius: "50%", background: p.color }} />
          ))}

          {playerResults.length > 0 ? (
            <div className="w-full">
              {playerResults.map((pr, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-800 last:border-0">
                  <span className="text-neutral-400 text-sm">{pr.name}</span>
                  <span className="text-white font-bold">{pr.food}</span>
                </div>
              ))}
            </div>
          ) : multiResults.length > 1 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {multiResults.map((r, i) => (
                <div key={i} className="border border-yellow-500/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-yellow-600 text-xs">{r.cat}</p>
                  <p className={`text-lg font-bold text-white ${spinning ? "opacity-20" : ""}`}>{r.food}</p>
                </div>
              ))}
            </div>
          ) : result ? (
            <>
              <p className="text-yellow-600 text-xs tracking-widest uppercase">{result.cat}</p>
              <p key={popKey} className={`text-3xl font-bold text-white ${spinning ? "opacity-20" : "pop-in"}`}>
                {result.food}
              </p>
              <div className="w-8 h-px bg-yellow-500/40 mx-auto"></div>
              {!spinning && (
                <div className="flex gap-2 mt-1 flex-wrap justify-center">
                  <button onClick={skipAndSpin}
                    className="text-xs text-neutral-500 hover:text-yellow-400 border border-neutral-700 hover:border-yellow-500 px-3 py-1 rounded-full transition-all">
                    ไม่เอา สุ่มใหม่
                  </button>
                  <button onClick={() => addBlacklist(result.food)}
                    className="text-xs text-neutral-500 hover:text-red-400 border border-neutral-700 hover:border-red-500 px-3 py-1 rounded-full transition-all">
                    ไม่ชอบ ✕
                  </button>
                  <button onClick={shareResult}
                    className="text-xs text-neutral-500 hover:text-yellow-400 border border-neutral-700 hover:border-yellow-500 px-3 py-1 rounded-full transition-all">
                    {shareMsg || "แชร์ 🔗"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-neutral-600 text-lg">กดสุ่มเมนูด้านล่าง</p>
          )}
        </div>
      </div>

      {/* Spin Button */}
      <button onClick={spin} disabled={spinning}
        className={`mb-10 px-12 py-4 bg-yellow-500 hover:bg-yellow-400 active:scale-95 disabled:opacity-40 text-black font-bold text-lg rounded-full transition-all tracking-wide ${shaking ? "shake" : ""}`}>
        {spinning ? "กำลังสุ่ม..." : "✦ สุ่มเมนู"}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-neutral-600 text-xs tracking-widest uppercase">เมนูที่สุ่มไปแล้ว</p>
            <button onClick={() => setHistory([])}
              className="text-neutral-700 hover:text-red-400 text-xs transition-all">ล้างประวัติ</button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-neutral-800 text-neutral-500 group">
                <span>{h.food}</span>
                <button onClick={() => addBlacklist(h.food)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all ml-1">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blacklist */}
      {blacklist.size > 0 && (
        <div className="w-full max-w-md">
          <p className="text-neutral-700 text-xs tracking-widest uppercase mb-3 text-center">เมนูที่ซ่อนไว้</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[...blacklist].map((food, i) => (
              <button key={i} onClick={() => removeBlacklist(food)}
                className="text-xs px-3 py-1 rounded-full border border-neutral-800 text-neutral-700 hover:text-yellow-500 hover:border-yellow-500/50 transition-all line-through">
                {food}
              </button>
            ))}
          </div>
          <p className="text-neutral-700 text-xs text-center mt-2">กดที่เมนูเพื่อเอากลับมา</p>
        </div>
      )}

    </div>
  )
}