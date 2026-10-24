// Optional adapter. Without a real configured counter it does not collect data.
(() => {
  const counter=document.body.dataset.metrikaId;
  if(!/^[1-9]\d{0,11}$/.test(counter||''))return;
  window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};
  window.ym.l=Date.now();
  const script=document.createElement('script');script.async=true;script.src='https://mc.yandex.ru/metrika/tag.js';document.head.append(script);
  const article=document.body.dataset.article;
  const send=(name,params)=>window.ym(Number(counter),'reachGoal',name,{article,...params});
  // Explicit hit preserves clean incoming campaign tags, not arbitrary query data.
  const safeURL=new URL(location.origin+location.pathname);
  const incoming=new URL(location.href);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']){
    const value=incoming.searchParams.get(key);
    if(value&&/^[\p{L}\p{N}_.-]{1,120}$/u.test(value))safeURL.searchParams.set(key,value);
  }
  let referer='';try{const u=new URL(document.referrer);if(['https:','http:'].includes(u.protocol))referer=u.origin+'/'}catch{/* Direct visit. */}
  window.ym(Number(counter),'init',{defer:true,clickmap:false,trackLinks:false,accurateTrackBounce:true,webvisor:false});
  window.ym(Number(counter),'hit',safeURL.href,{referer,title:document.title,params:{article}});
  send('blog_view',{path:location.pathname});
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[data-cta]');if(!link)return;
    send('blog_cta_click',{article:link.dataset.article,placement:link.dataset.placement,target:link.dataset.cta});
  });
  const frame=document.querySelector('iframe[data-youtube]');
  if(frame){
    window.onYouTubeIframeAPIReady=()=>{let started=false;new window.YT.Player(frame,{events:{onStateChange(event){if(event.data===1&&!started){started=true;send('blog_video_start',{video:frame.dataset.youtube})}if(event.data===0)send('blog_video_complete',{video:frame.dataset.youtube})}}})};
    const api=document.createElement('script');api.async=true;api.src='https://www.youtube.com/iframe_api';document.head.append(api);
  }
})();
