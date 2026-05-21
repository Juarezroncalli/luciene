// App.jsx — Luciene Lessa one-pager

const { useState, useEffect, useRef } = React;

// ============ Hooks ============
function useReveal(opts = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      });
    }, { threshold: opts.threshold ?? 0.15, rootMargin: opts.rootMargin || "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return [ref, shown];
}

function Reveal({ as: As = "div", delay = 0, stagger = false, className = "", children, ...rest }) {
  const [ref, shown] = useReveal();
  const cls = (stagger ? "reveal-stagger" : "reveal") + (shown ? " in" : "") + (className ? " " + className : "");
  const style = { ...(rest.style || {}), "--rd": `${delay}ms` };
  return <As ref={ref} className={cls} {...rest} style={style}>{children}</As>;
}

function CountUp({ to, prefix = "", suffix = "", duration = 1600 }) {
  const [ref, shown] = useReveal({ threshold: 0.4 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!shown) return;
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, to, duration]);
  return (
    <span ref={ref} style={{ fontSize: "80px" }}>
      {prefix}{v.toLocaleString("pt-BR")}{suffix}
    </span>);

}

function WordReveal({ text, className = "" }) {
  const [ref, shown] = useReveal({ threshold: 0.2 });
  const words = text.split(" ");
  return (
    <span ref={ref} className={"line-words " + (shown ? "in " : "") + className}>
      {words.map((w, i) =>
      <span className="word" key={i} style={{ "--i": i }}>{w}</span>
      )}
    </span>);

}

// ============ Brand mark ============
function BrandMark({ size = 26, color }) {
  return (
    <span className="brand-mark" style={{ fontSize: size, color: color || "var(--ink)" }}>
      <span className="l1">L</span>
      <span className="l2">L</span>
    </span>);

}

// ============ Nav ============
function Nav({ onContact }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand-logo" aria-label="Luciene Lessa — início">
          <img src="assets/logo-mark.png" alt="L7 · Luciene Lessa" />
          <span className="pipe"></span>
          <span className="ttl">
            <strong>Luciene Lessa</strong>
            Psicologia · Consultoria
          </span>
        </a>
        <nav className="nav-links" style={{ fontSize: "16px" }}>
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Áreas</a>
          <a href="#destaques">Destaques</a>
          <a href="#processo">Processo</a>
          <a href="#contato">Contato</a>
        </nav>
        <a href="#contato" className="nav-cta" onClick={onContact}>
          <span className="lbl" style={{ fontSize: "16px" }}>Marque sua consulta</span>
          <span className="arrow">→</span>
        </a>
      </div>
    </header>);

}

// ============ Hero ============
function Hero() {
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const hoje = new Date();
  const mesAtual = `${meses[hoje.getMonth()]} / ${hoje.getFullYear()}`;
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <div className="availability">
            <span className="pulse"></span>
            Atendendo · {mesAtual}
          </div>
          <h1>
            Cuidar de si é o <span className="em">primeiro passo</span> para transformar o mundo ao redor.
          </h1>
          <Reveal delay={400}>
            <p className="hero-sub">
              Há 35 anos acompanhando pessoas, equipes e instituições em
              processos de autoconhecimento, equilíbrio e desenvolvimento humano —
              com escuta cuidadosa, base científica e profundo respeito pela sua história.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="hero-cta-row">
              <a href="#contato" className="btn btn-primary" style={{ fontSize: "16px" }}>
                Agendar consulta <span className="arrow">→</span>
              </a>
              <a href="#sobre" className="btn btn-ghost" style={{ fontSize: "16px" }}>
                Conhecer a Luciene
              </a>
            </div>
          </Reveal>
          <Reveal stagger delay={700}>
            <div className="hero-meta">
              <div className="stat">
                <div className="n"><CountUp to={35} /></div>
                <div className="l">Anos de prática clínica</div>
              </div>
              <div className="stat">
                <div className="n"><span className="pre" style={{ fontSize: "40px" }}>+</span><CountUp to={30} /><span className="post" style={{ fontSize: "40px" }}>k</span></div>
                <div className="l">Vidas acompanhadas</div>
              </div>
              <div className="stat">
                <div className="n"><CountUp to={3} /></div>
                <div className="l">Áreas de atuação</div>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal as="div" className="hero-portrait-frame" delay={200}>
          <div className="floater f1">
            “Diagnóstico não te <em>define</em>.”
            <small>Reflexão · 2025</small>
          </div>
          <div className="hero-portrait">
            <image-slot
              id="ll-hero-portrait"
              shape="rect"
              fit="cover"
              src="assets/foto-hero-verde.jpeg"
              placeholder="Solte aqui o retrato principal · clique 2× para reenquadrar" />
            
            <span className="tag">retrato</span>
            <div className="label">
              <span>LL · 2026</span>
              <span>Sete Lagoas / MG</span>
            </div>
          </div>
          <div className="floater f2">
            Atendimento <em>presencial</em> &amp; online
            <small>Sete Lagoas · Brasil</small>
          </div>
          <span className="sig">L · L</span>
        </Reveal>
      </div>
    </section>);

}

// ============ Ribbon ============
function Ribbon() {
  const items = [
  "Psicologia Clínica",
  "Consultoria Organizacional",
  "Psicologia Educacional",
  "Desenvolvimento de Pessoas",
  "Mestre · Doutoranda em Psicologia",
  "Atendimento presencial & online"];

  const loop = [...items, ...items];
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-track">
        {loop.map((t, i) =>
        <span className="ribbon-item" key={i}>{t}</span>
        )}
      </div>
    </div>);

}

// ============ Sobre ============
function Sobre() {
  return (
    <section className="section" id="sobre">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">01 / Sobre</div>
              <div className="name">Quem é Luciene Lessa</div>
            </div>
            <h2>
              Psicóloga, professora e<br />
              eterna <span className="em">aprendiz</span> do humano.
            </h2>
          </div>
        </Reveal>
        <div className="sobre-grid">
          <Reveal as="div" className="sobre-portrait">
            <image-slot
              id="ll-sobre-portrait"
              shape="rect"
              fit="cover"
              src="assets/foto-sobre-cafe.jpeg"
              placeholder="Solte aqui uma foto de consultório ou retrato · clique 2× para reenquadrar" />
            
            <span className="ph-label">retrato · sala de consulta</span>
          </Reveal>
          <Reveal as="div" className="sobre-text" delay={150}>
            <p className="lead">
              Acredito que terapia não é desconforto: é direção.
              Diagnóstico não é identidade — é caminho.
            </p>
            <p>
              Sou Luciene Lessa, psicóloga clínica e consultora organizacional
              há mais de três décadas. Mestre e doutoranda em Psicologia e
              Desenvolvimento de Pessoas, atendo adultos, adolescentes e
              equipes em processos terapêuticos, formativos e de transformação.
            </p>
            <p>
              Trabalho a partir de uma escuta cuidadosa e de uma base sólida em
              teoria psicológica — unindo a clínica, a educação e o mundo
              corporativo numa prática que respeita a singularidade de cada
              história. Sou também mãe de duas filhas, Marcela e Rafaela,
              apaixonada por dança, leitura e por um bom cafezinho.
            </p>
            <dl className="sobre-facts">
              <div>
                <dt>Formação</dt>
                <dd>Mestre · Doutoranda em Psicologia</dd>
              </div>
              <div>
                <dt>Experiência</dt>
                <dd>35 anos de clínica</dd>
              </div>
              <div>
                <dt>Atuação</dt>
                <dd>Clínica · Educacional · Organizacional</dd>
              </div>
              <div>
                <dt>Atendimento</dt>
                <dd>Sete Lagoas / MG &amp; online</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>);

}

// ============ Serviços ============
const SERVICOS = [
{
  num: "01",
  titulo: "Clínica",
  em: "individual",
  desc: "Espaço terapêutico para adultos e adolescentes que buscam autoconhecimento, equilíbrio emocional e novos olhares sobre sua história.",
  items: ["Ansiedade e esgotamento", "Recomeços e luto", "Relações e autoestima", "Transtornos de humor"]
},
{
  num: "02",
  titulo: "Educacional",
  em: "& docência",
  desc: "Acompanhamento de crianças, jovens e instituições escolares em processos de aprendizagem, vínculo e desenvolvimento humano.",
  items: ["Orientação profissional", "Dificuldades de aprendizagem", "TDAH e neurodivergências", "Formação de educadores"]
},
{
  num: "03",
  titulo: "Consultoria",
  em: "organizacional",
  desc: "Apoio a líderes, equipes e empresas no desenvolvimento de pessoas, cultura e tomada de decisão consciente.",
  items: ["Liderança & autoconhecimento", "Diagnóstico organizacional", "Treinamentos in-company", "Coaching executivo"]
}];


function Servicos() {
  return (
    <section className="section servicos" id="servicos">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">02 / Atuação</div>
              <div className="name">Áreas de trabalho</div>
            </div>
            <h2>
              Três frentes, uma mesma<br />
              <span className="em">escuta</span> cuidadosa.
            </h2>
          </div>
        </Reveal>
      </div>
      <div className="wrap">
        <Reveal stagger as="div" className="serv-grid">
          {SERVICOS.map((s) =>
          <article className="serv" key={s.num}>
              <div className="num">{s.num}</div>
              <h3>
                {s.titulo}<br />
                <span className="em">{s.em}</span>
              </h3>
              <p>{s.desc}</p>
              <ul>
                {s.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
              <a href="#contato" className="more">
                Saber mais <span>→</span>
              </a>
            </article>
          )}
        </Reveal>
      </div>
    </section>);

}

// ============ Abordagem ============
const PRINCIPIOS = [
{
  num: "P / 01",
  titulo: "Diagnóstico é direção",
  em: "não definição.",
  desc: "Um nome para o que se sente é mapa, não muro. Ele deve significar liberdade — nunca limitação."
},
{
  num: "P / 02",
  titulo: "Escuta antes de receita,",
  em: "vínculo antes de técnica.",
  desc: "Cada história pede um ritmo. A clínica começa quando a pressa termina e a presença começa."
},
{
  num: "P / 03",
  titulo: "Recomeçar não é",
  em: "voltar ao zero.",
  desc: "É voltar para si. Todo processo terapêutico é também um retorno — e um redescobrimento — daquilo que já é seu."
},
{
  num: "P / 04",
  titulo: "Ciência e",
  em: "humanidade, juntas.",
  desc: "Base teórica sólida, atualização constante e profundo respeito pela singularidade de quem chega até o consultório."
}];


function Abordagem() {
  return (
    <section className="section" id="abordagem">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">04 / Abordagem</div>
              <div className="name">Como trabalho</div>
            </div>
            <h2>
              Uma clínica feita de<br />
              <span className="em">presença</span>, método e tempo.
            </h2>
          </div>
        </Reveal>
        <div className="abordagem-grid">
          <Reveal as="div" className="abordagem-q">
            <p className="quote">
              “Fazer muitas coisas ao mesmo tempo nem sempre é sinal de saúde.
              Às vezes, o <span className="em">excesso de fazer</span> é
              apenas um modo de não ter tempo para sentir.”
            </p>
            <div className="att">— Reflexão de consultório</div>
          </Reveal>
          <Reveal stagger as="div" className="princ">
            {PRINCIPIOS.map((p) =>
            <div className="princ-item" key={p.num}>
                <div className="num">{p.num}</div>
                <div>
                  <h4>{p.titulo} <span className="em">{p.em}</span></h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>);

}

// ============ Destaques (themes) ============
const DESTAQUES = [
{
  num: "01",
  t: "Ansiedade", em: "& esgotamento",
  r: "Quando o corpo grita o que a mente cala. A ansiedade não é fraqueza — é um sinal que pede pausa, escuta e ressignificação."
},
{
  num: "02",
  t: "TDAH", em: "e neurodivergências",
  r: "Receber um diagnóstico é abrir um mapa, não fechar uma porta. Há muitos fatores positivos no TDAH — e caminho para todos eles."
},
{
  num: "03",
  t: "Recomeços", em: "& luto",
  r: "Recomeçar não é voltar ao zero. É voltar para si, depois de tudo o que aconteceu — e seguir adiante com mais verdade."
},
{
  num: "04",
  t: "Diagnóstico", em: "diferencial",
  r: "Confundir ansiedade com depressão, bipolar com borderline, atrasa o tratamento certo. O diagnóstico deve ser direção — nunca rótulo."
},
{
  num: "05",
  t: "Liderança", em: "consciente",
  r: "Liderar não é controlar. É evoluir por dentro antes de vencer por fora — e abrir espaço para que outros também floresçam."
},
{
  num: "06",
  t: "Relações", em: "& vínculos",
  r: "Toda relação espelha a relação que temos conosco. Cuidar do vínculo começa por cuidar de quem o estabelece."
},
{
  num: "07",
  t: "Autoestima", em: "& identidade",
  r: "Valorize o que é simples — costuma sustentar o que é essencial. Seu valor não se mede pelo olhar do outro."
},
{
  num: "08",
  t: "Saúde", em: "mental no trabalho",
  r: "O mercado muda, a pressão aumenta. Equilíbrio entre vida pessoal e profissional não é luxo — é condição."
}];


function Destaques() {
  return (
    <section className="section destaques" id="destaques">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">03 / Destaques</div>
              <div className="name">Temas em consultório</div>
            </div>
            <h2>
              O que costuma chegar<br />
              até <span className="em">a escuta.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal stagger>
          <div className="dest-grid">
            {DESTAQUES.map((d) =>
            <article className="dest" key={d.num}>
                <div className="num">{d.num}</div>
                <h3 className="t">{d.t} <span className="em">{d.em}</span></h3>
                <p className="r">“{d.r}”</p>
              </article>
            )}
          </div>
        </Reveal>
      </div>
    </section>);

}

// ============ Processo ============
const PROCESSO = [
{ n: "01", tag: "Contato", t: "Você envia", em: "uma mensagem.", d: "Pelo WhatsApp ou Instagram, conte brevemente o que te trouxe até aqui. Retorno em até 24h com horários disponíveis." },
{ n: "02", tag: "Acolhida", t: "O primeiro", em: "encontro.", d: "Sessão inicial de escuta, sem cobrança de hipóteses. Conversamos sobre sua história, momento atual e expectativas para o processo." },
{ n: "03", tag: "Direção", t: "Construímos", em: "o caminho.", d: "Definimos juntas a frequência, os objetivos terapêuticos e o ritmo das sessões. Plano vivo, revisitado sempre que necessário." },
{ n: "04", tag: "Travessia", t: "O cuidado", em: "continua.", d: "Sessões semanais ou quinzenais, presenciais em Sete Lagoas ou online. Espaço seguro para sentir, pensar e recomeçar." }];


function Processo() {
  return (
    <section className="section processo" id="processo">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">05 / Processo</div>
              <div className="name">Como funciona</div>
            </div>
            <h2>
              Do primeiro contato<br />
              ao primeiro <span className="em">passo.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal stagger>
          <div className="proc-rail">
            {PROCESSO.map((p) =>
            <div className="proc-step" key={p.n}>
                <span className="marker">{p.n}</span>
                <h4>{p.t} <span className="em">{p.em}</span></h4>
                <p>{p.d}</p>
                <span className="tag">{p.tag}</span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>);

}

// ============ Pensamento (split feature) ============
function Pensamento() {
  return (
    <section className="pensamento" id="pensamento">
      <div className="pens-grid">
        <Reveal as="div" className="pens-photo">
          <image-slot
            id="ll-pensamento-pb"
            shape="rect"
            fit="cover"
            src="assets/foto-tablet-pb.jpeg"
            placeholder="Solte aqui uma foto contemplativa · clique 2× para reenquadrar" />
        </Reveal>
        <Reveal as="div" className="pens-text" delay={150}>
          <div className="pens-eyebrow">Pensamento do consultório</div>
          <p className="pens-q">
            A necessidade de ter <em className="em">o controle</em> das situações é uma das características mais marcantes nos transtornos de ansiedade.
          </p>
          <div className="pens-src">@lulessamoreira</div>
        </Reveal>
      </div>
    </section>
  );
}

// ============ Reflexões ============
const QUOTES = [
{ q: "O seu diagnóstico não te define — ele deve significar liberdade, e não limitação.", src: "@lulessamoreira · 2025" },
{ q: "Recomeçar não é voltar ao zero. É voltar para si.", src: "@lulessamoreira · 2025" },
{ q: "Quando tudo parecer sobrecarregado, lembre-se: um pensamento de cada vez, uma tarefa de cada vez, um dia de cada vez.", src: "@lulessamoreira · 2024" },
{ q: "Ninguém é forte o tempo todo, e está tudo bem. Apenas respire, descanse e recomece.", src: "@lulessamoreira · 2024" },
{ q: "Crie. Arrisque. Conquiste. O mundo precisa da sua autenticidade.", src: "@lulessamoreira · 2025" }];


function Reflexoes() {
  const [i, setI] = useState(0);
  const total = QUOTES.length;

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % total), 7000);
    return () => clearInterval(id);
  }, [total]);

  const go = (d) => setI((v) => (v + d + total) % total);

  return (
    <section className="section reflexoes" id="reflexoes">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">06 / Reflexões</div>
              <div className="name">Do consultório</div>
            </div>
            <h2>
              Pensamentos que <span className="em">caminham</span><br />
              comigo.
            </h2>
          </div>
        </Reveal>
        <div className="refl-stage">
          <div className="refl-card">
            <p className="refl-q" key={i}>
              “{QUOTES[i].q}”
            </p>
            <div className="refl-source">{QUOTES[i].src}</div>
          </div>
          <div className="refl-controls">
            <div className="refl-count">
              {String(i + 1).padStart(2, "0")} <span style={{ opacity: 0.5 }}>/ {String(total).padStart(2, "0")}</span>
            </div>
            <div className="refl-btns">
              <button aria-label="anterior" onClick={() => go(-1)}>←</button>
              <button aria-label="próxima" onClick={() => go(1)}>→</button>
            </div>
            <div className="refl-dots">
              {QUOTES.map((_, idx) =>
              <button
                key={idx}
                className={"refl-dot " + (idx === i ? "active" : "")}
                onClick={() => setI(idx)}
                aria-label={`reflexão ${idx + 1}`}
                style={{ border: "none", cursor: "pointer", padding: 0 }} />

              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ============ Contato ============
function Contato() {
  return (
    <section className="section contato" id="contato">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <div className="label">
              <div className="num">07 / Contato</div>
              <div className="name">Marque sua consulta</div>
            </div>
            <h2>
              O primeiro passo<br />
              já é <span className="em">cuidado.</span>
            </h2>
          </div>
        </Reveal>
        <div className="contato-grid">
          <Reveal as="div">
            <p className="contato-sub">
              Atendimento presencial na Rua Princesa Isabel, 246 — Sala 304 — Centro, Sete Lagoas/MG, e online para todo o Brasil.
              Envie uma mensagem pelo WhatsApp e em breve retornarei com horários
              disponíveis e orientações para o primeiro encontro.
            </p>
            <a
              href="https://wa.me/5531987788210"
              target="_blank"
              rel="noopener"
              className="contato-cta" style={{ fontSize: "16px" }}>
              
              Falar pelo WhatsApp <span className="arrow">→</span>
            </a>
          </Reveal>
          <Reveal as="div" className="contato-card" delay={150}>
            <h4>Onde me encontrar</h4>
            <ul className="contato-list">
              <li>
                <span className="lbl">Telefone · WhatsApp</span>
                <span className="val"><a href="tel:+5531987788210">(31) 98778-8210</a></span>
              </li>
              <li>
                <span className="lbl">Instagram</span>
                <span className="val"><a href="https://instagram.com/lulessamoreira" target="_blank" rel="noopener">@lulessamoreira</a></span>
              </li>
              <li>
                <span className="lbl">Link na bio</span>
                <span className="val"><a href="https://bio.site/lucienelessa" target="_blank" rel="noopener">bio.site/lucienelessa</a></span>
              </li>
              <li>
                <span className="lbl">Endereço</span>
                <span className="val"><a href="https://maps.google.com/?q=Rua+Princesa+Isabel,+246,+Sala+304,+Centro,+Sete+Lagoas+MG" target="_blank" rel="noopener">Rua Princesa Isabel, 246 · Sala 304</a></span>
                <span style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Centro · Sete Lagoas / MG</span>
              </li>
              <li>
                <span className="lbl">Atendimento</span>
                <span className="val">Presencial &amp; online</span>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>);

}

// ============ Footer ============
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          <div>
            <div className="footer-mark">
              <img src="assets/logo-luciene-lessa.png" alt="Luciene Lessa · Psicologia | Consultoria" />
            </div>
          </div>
          <div className="footer-meta">
            CRP 04/9072<br />
            Rua Princesa Isabel, 246 · Sala 304 · Centro<br />
            Sete Lagoas / MG — (31) 98778-8210
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Luciene Lessa</span>
          <span>Feito com escuta</span>
        </div>
      </div>
    </footer>);

}

// ============ App ============
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "sage",
  "headlineFont": "Cormorant Garamond",
  "bodyFont": "Jost",
  "showRibbon": true
} /*EDITMODE-END*/;

function App() {
  const t = (window.useTweaks || (() => [TWEAK_DEFAULTS, () => {}]))(TWEAK_DEFAULTS);
  const tweaks = t[0];
  const setTweak = t[1];

  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme === "sage" ? "" : tweaks.theme;
    document.documentElement.style.setProperty("--font-serif", `"${tweaks.headlineFont}", "Cormorant", Georgia, serif`);
    document.documentElement.style.setProperty("--font-sans", `"${tweaks.bodyFont}", "Helvetica Neue", Arial, sans-serif`);
  }, [tweaks.theme, tweaks.headlineFont, tweaks.bodyFont]);

  const TweaksPanel = window.TweaksPanel;
  const TweakSection = window.TweakSection;
  const TweakRadio = window.TweakRadio;
  const TweakSelect = window.TweakSelect;
  const TweakToggle = window.TweakToggle;

  return (
    <>
      <Nav />
      <Hero />
      {tweaks.showRibbon && <Ribbon />}
      <Sobre />
      <Servicos />
      <Destaques />
      <Pensamento />
      <Abordagem />
      <Processo />
      <Reflexoes />
      <Contato />
      <Footer />

      {TweaksPanel &&
      <TweaksPanel title="Tweaks">
          <TweakSection label="Paleta">
            <TweakRadio
            label="Tom"
            value={tweaks.theme === "dark" ? "sage" : tweaks.theme}
            options={[
            { value: "sage", label: "Sage" },
            { value: "sand", label: "Areia" },
            { value: "forest", label: "Mata" }]
            }
            onChange={(v) => setTweak("theme", v)} />
          
            <TweakRadio
            label="Modo"
            value={tweaks.theme === "dark" ? "escuro" : "claro"}
            options={[
            { value: "claro", label: "Claro" },
            { value: "escuro", label: "Escuro" }]
            }
            onChange={(v) => setTweak("theme", v === "escuro" ? "dark" : "sage")} />
          
          </TweakSection>
          <TweakSection label="Tipografia">
            <TweakSelect
            label="Títulos"
            value={tweaks.headlineFont}
            options={[
            "Cormorant Garamond",
            "DM Serif Display",
            "Cardo",
            "Playfair Display",
            "Libre Caslon Text"]
            }
            onChange={(v) => setTweak("headlineFont", v)} />
          
            <TweakSelect
            label="Corpo"
            value={tweaks.bodyFont}
            options={["Jost", "Manrope", "Work Sans", "Nunito Sans"]}
            onChange={(v) => setTweak("bodyFont", v)} />
          
          </TweakSection>
          <TweakSection label="Layout">
            <TweakToggle
            label="Faixa rolante"
            value={tweaks.showRibbon}
            onChange={(v) => setTweak("showRibbon", v)} />
          
          </TweakSection>
        </TweaksPanel>
      }
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);