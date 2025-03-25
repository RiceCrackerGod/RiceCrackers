const themeToggleBtn=document.getElementById("theme-toggle"),themeToggleIcon=themeToggleBtn.querySelector("i");let currentTheme=localStorage.getItem("theme")||"light";document.documentElement.classList.toggle("dark","dark"===currentTheme),updateThemeIcon(),themeToggleBtn.addEventListener("click",()=>{currentTheme="light"===currentTheme?"dark":"light",document.documentElement.classList.toggle("dark","dark"===currentTheme),localStorage.setItem("theme",currentTheme),updateThemeIcon()});function updateThemeIcon(){"dark"===currentTheme?(themeToggleIcon.classList.remove("fa-moon"),themeToggleIcon.classList.add("fa-sun")):(themeToggleIcon.classList.remove("fa-sun"),themeToggleIcon.classList.add("fa-moon"))}const observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add("animate-in")})},{threshold:.1});document.querySelectorAll(".service-card").forEach(e=>{e.classList.add("animate-item"),observer.observe(e)});const style=document.createElement("style");style.textContent=".animate-item{opacity:0;transform:translateY(20px);transition:opacity .6s ease-out,transform .6s ease-out}.animate-in{opacity:1;transform:translateY(0)}",document.head.appendChild(style);function openDonationInfo(){const e=document.getElementById("donation-info"),t=document.getElementById("scroll-target");"none"===e.style.display||""===e.style.display?(e.style.display="block",t.scrollIntoView({behavior:"smooth",block:"start"})):e.style.display="none"}document.querySelectorAll(".contract-address").forEach(e=>{e.addEventListener("click",()=>{const t=e.textContent.split(": ").map(e=>e.trim()),[n,r]=t;navigator.clipboard.writeText(r).then(()=>{e.style.backgroundColor="rgba(255,156,0,0.3)",setTimeout(()=>{e.style.backgroundColor="var(--card)"},500),showNotification(`${n} Copied`)}).catch(e=>console.error("Failed to copy: ",e))})});function showNotification(e){const t=document.querySelector(".notification");t&&t.remove();const n=document.createElement("div");n.className="notification",n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.classList.add("show")},10),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>{n.remove()},300)},2e3)}function twitter(){window.location.href="https://x.com/ricecrackergod"}

fetch("https://script.google.com/macros/s/AKfycbxiFXz6KF54Q5Cv-PF58FxLCsDPLhkETUyK0Bsc1A6XMwF5ZiwvBlLvVLpNNHp-3MpM/exec")
  .then(e => e.json())
  .then(e => {
    const t = e.manhwa_list,
          n = document.getElementById("manhwa-container"),
          r = document.getElementById("latest-manhwa"),
          a = new Map;
    t.forEach(e => {
      const t = e.title,
            n = e.chapters.length > 0 ? Math.max(...e.chapters.map(e => e.chapter_number)) : "N/A";
      a.has(t) ?
        n !== "N/A" && (a.get(t).maxChapter === "N/A" || n > a.get(t).maxChapter) &&
        a.set(t, { ...a.get(t), maxChapter: n, cover_image: e.cover_image || a.get(t).cover_image }) :
        a.set(t, { title: t, maxChapter: n, cover_image: e.cover_image || "https://via.placeholder.com/200" });
    });
    const c = Array.from(a.values()),
          o = c.pop(),
          l = c;
    requestAnimationFrame(() => {
      l.forEach(e => {
        const t = document.createElement("div");
        t.style.cssText = "display:flex;flex-direction:column;align-items:center;width:100%;max-width:200px;max-height:270px;padding:5px;box-sizing:border-box;flex:1";
        t.innerHTML = `<a href="/read/${e.title.replace(/\s+/g,"-")}"><img src="${e.cover_image}" loading="lazy" width="150" height="200" style="object-fit:cover;display:block;margin:2px auto;"></a><h4 style="font-size:clamp(0.6rem,1.5vw,1rem);margin:2px 0;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-wrap:wrap;transform:scale(0.8);">${e.title}</h4><a href="/read/${e.title.replace(/\s+/g,"-")}/chapter-${e.maxChapter}" style="text-align:center;margin:2px 0;flex:1;"><p style="font-size:clamp(0.7rem,1.2vw,0.875rem);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Latest Chapter: ${e.maxChapter}</p></a><hr style="width:80%;margin:2px auto;">`;
        n.appendChild(t);
        // Add this line to remove section with class "container" after first div
        document.querySelector(".containerloader")?.remove();
      });
      o && ((e => {
        const t = document.createElement("div");
        t.style.cssText = "display:flex;flex-direction:column;align-items:center;width:100%;max-width:200px;max-height:270px;padding:5px;box-sizing:border-box;flex:1";
        t.innerHTML = `<a href="/read/${e.title.replace(/\s+/g,"-")}"><img src="${e.cover_image}" loading="lazy" width="150" height="200" style="object-fit:cover;display:block;margin:2px auto;"></a><h4 style="font-size:clamp(0.6rem,1.5vw,1rem);margin:2px 0;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-wrap:wrap;transform:scale(0.8);">${e.title}</h4><a href="/read/${e.title.replace(/\s+/g,"-")}/chapter-${e.maxChapter}" style="text-align:center;margin:2px 0;flex:1;"><p style="font-size:clamp(0.7rem,1.2vw,0.875rem);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Latest Chapter: ${e.maxChapter}</p></a><hr style="width:80%;margin:2px auto;">`;
        r.appendChild(t);
      })(o));
    });
  })
  .catch(e => console.error("Error fetching JSON:", e));