// AICodingGuideES — /guides/ai-coding/es   CSS prefix: ait-
// Spanish translation of the AI coding guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, CodingGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "¿Necesito saber programar para usar un asistente de código con IA?", a: "Ayuda mucho. La IA puede escribir código que no entiendes, pero aún así debes ejecutarlo, probarlo y juzgar si es correcto y seguro. Empieza con poco y pídele a la IA que te explique cada parte." },
    { q: "¿La IA escribirá toda mi aplicación por mí?", a: "Puede generar grandes fragmentos, pero las peticiones más grandes tienen más probabilidades de contener errores o fallos sutiles. Trabajar una función o un archivo a la vez mantiene el resultado revisable y más fácil de corregir." },
    { q: "¿El código generado por IA siempre es seguro?", a: "No. Los asistentes pueden producir código con fallos de seguridad o prácticas obsoletas. Revisa con especial cuidado todo lo que toque autenticación, pagos, datos de usuarios o la red." },
    { q: "¿Puedo confiar en la explicación del código que da la IA?", a: "Suele ser útil, pero no está garantizada. Si una explicación y el código no coinciden, confía en lo que realmente ocurre al ejecutarlo y verifícalo con la documentación oficial." },
];

export default function AICodingGuideES() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Guía para usar la IA en la programación | CinNova"
                description="Aprende a usar asistentes de código con IA para planificar proyectos, escribir funciones pequeñas, depurar errores, explicar código y revisar con seguridad antes de publicar. Guía paso a paso para principiantes."
                pageKey="ai-coding-guide-es"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/guides">← Tutoriales de IA</a>
                <p className="eyebrow">IA PARA PROGRAMAR · PRINCIPIANTES</p>
                <h1>Cómo usar la IA para programar: guía paso a paso para principiantes</h1>
                <p className="ait-guide-intro">
                    Los asistentes de código con IA pueden planificar proyectos, escribir funciones y explicar
                    errores, convirtiendo horas de búsqueda en minutos. Pero también cometen errores con total
                    seguridad. Esta guía muestra un flujo de trabajo seguro y revisable.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Principiante</span>
                    <span className="ait-chip ait-chip--muted">9 min de lectura</span>
                    <span className="ait-chip ait-chip--muted">Guía atemporal</span>
                </div>
            </section>

            <CodingGuideLangNav current="es" />

            <p className="section ait-starter-note">
                Esta guía traducida forma parte de la biblioteca multilingüe inicial de CinNova. Pronto
                habrá más tutoriales traducidos.
            </p>

            <section className="section ait-guide-body">
                <h2>En qué pueden ayudar los asistentes de código con IA</h2>
                <ul className="ait-list">
                    <li>Explicar código, errores y conceptos desconocidos.</li>
                    <li>Redactar funciones pequeñas o archivos únicos a partir de una descripción.</li>
                    <li>Sugerir soluciones cuando pegas un mensaje de error.</li>
                    <li>Refactorizar el código para que sea más claro o más seguro.</li>
                    <li>Escribir pruebas y ejemplos de uso.</li>
                </ul>

                <h2>Lo que no pueden garantizar</h2>
                <Callout tone="warn" title="Tú sigues siendo el ingeniero">
                    <ul className="ait-list">
                        <li>Que el código sea correcto: puede parecer bien y aun así estar mal.</li>
                        <li>Que sea seguro o esté actualizado con las mejores prácticas actuales.</li>
                        <li>Que encaje con tus versiones, tu entorno o tus requisitos exactos.</li>
                        <li>Que no rompa silenciosamente otra cosa en tu proyecto.</li>
                    </ul>
                </Callout>

                <h2>Paso a paso</h2>
                <div className="ait-steps">
                    <Step n={1} title="Describe tu proyecto">
                        <p>Dale al asistente la visión general: qué construyes, el lenguaje y las herramientas, y el objetivo. El contexto por adelantado evita sugerencias que no encajan.</p>
                        <PromptExample label="Ejemplo">Estoy creando una página web sencilla con HTML, CSS y JavaScript puros que muestra una lista de tareas guardada en el navegador. Sin frameworks.</PromptExample>
                    </Step>
                    <Step n={2} title="Pide primero un plan sencillo">
                        <p>Antes de cualquier código, consigue un plan corto. Es más fácil corregir un plan que desenredar código malo.</p>
                        <PromptExample label="Ejemplo">Dame un plan numerado y sencillo para construir esto. No escribas código todavía.</PromptExample>
                    </Step>
                    <Step n={3} title="Pide un archivo o una función a la vez">
                        <p>Las peticiones pequeñas y enfocadas producen código que puedes leer y probar de verdad. Ve construyendo pieza a pieza.</p>
                        <PromptExample label="Ejemplo">Escribe solo la función que guarda una tarea en el almacenamiento local. Que sea pequeña y añade comentarios.</PromptExample>
                    </Step>
                    <Step n={4} title="Pide a la IA que explique el código">
                        <p>Nunca pegues código que no entiendes. Pide una explicación línea por línea y qué podría salir mal.</p>
                        <PromptExample label="Ejemplo">Explica esta función línea por línea y enumera los casos límite que no maneja.</PromptExample>
                    </Step>
                    <Step n={5} title="Ejecuta el código en tu equipo">
                        <p>Ejecútalo de verdad en tu propio entorno. La prueba real es el comportamiento, no la descripción de la IA. Prueba entradas normales e inusuales.</p>
                    </Step>
                    <Step n={6} title="Devuelve los errores a la IA">
                        <p>Cuando algo falle, pega el mensaje de error completo y el código relevante. Los errores específicos reciben soluciones específicas.</p>
                        <PromptExample label="Ejemplo">Obtuve este error al ejecutar el código: [pega el error completo]. Aquí está la función: [pega]. ¿Qué falla y cómo lo arreglo?</PromptExample>
                    </Step>
                    <Step n={7} title="Pide código más seguro o refactorizado">
                        <p>Una vez que funcione, pide al asistente que lo mejore: nombres más claros, manejo de errores y patrones más seguros.</p>
                        <PromptExample label="Ejemplo">Refactoriza esto para que sea más legible, añade manejo básico de errores y señala cualquier problema de seguridad.</PromptExample>
                    </Step>
                    <Step n={8} title="Revisa antes de publicar">
                        <p>Tú eres responsable de lo que publicas. Lee cada cambio, ejecuta tus pruebas y asegúrate de entenderlo antes de confirmar.</p>
                        <Callout tone="info" title="Lista rápida de revisión">
                            <ul className="ait-list">
                                <li>¿Entiendo lo que hace este código?</li>
                                <li>¿Lo ejecuté y probé los casos límite?</li>
                                <li>¿Maneja de forma segura secretos, datos de usuarios o la red?</li>
                                <li>¿Rompe alguna otra cosa?</li>
                            </ul>
                        </Callout>
                    </Step>
                </div>

                <h2>Ejemplos de prompts para programar</h2>
                <PromptExample label="Construir">Escribe una función de JavaScript pequeña y bien comentada que valide una dirección de correo. Que sea sencilla y explica el enfoque.</PromptExample>
                <PromptExample label="Entender">¿Qué hace esta expresión regular y dónde podría fallar? [pega]</PromptExample>

                <h2>Ejemplos de prompts para depurar</h2>
                <PromptExample label="Depurar">Esta función debería devolver números ordenados, pero los devuelve como cadenas. Aquí está el código y una entrada/salida de ejemplo: [pega]. ¿Por qué y cómo lo arreglo?</PromptExample>
                <PromptExample label="Depurar">Mi página carga, pero el botón no hace nada. Aquí están el HTML y el JS: [pega]. Guíame sobre qué revisar primero.</PromptExample>

                <h2>Errores de principiante que evitar</h2>
                <ul className="ait-list">
                    <li>Pegar grandes cantidades de código de IA sin leerlo ni ejecutarlo.</li>
                    <li>Pedir una aplicación entera en un solo prompt en lugar de piezas pequeñas.</li>
                    <li>Suponer que el código es seguro o que coincide con las versiones de tus librerías.</li>
                    <li>Saltarte las pruebas locales porque «parece correcto».</li>
                    <li>Confirmar cambios que no entiendes.</li>
                </ul>

                <h2>Nota de seguridad</h2>
                <Callout tone="bad" title="Nunca pegues secretos">
                    <p>No pegues claves de API, contraseñas, tokens, claves privadas, datos de clientes ni código propietario en una herramienta de IA. Sustituye los secretos por marcadores como <code>YOUR_API_KEY</code> antes de compartir código, y renueva cualquier secreto que hayas podido exponer.</p>
                </Callout>
                <Callout tone="warn" title="Recordatorio de privacidad y seguridad">
                    <ul className="ait-list">
                        <li>No pegues datos privados, contraseñas, claves de API ni archivos confidenciales en las herramientas de IA.</li>
                        <li>Las interfaces cambian con frecuencia: revisa siempre la configuración y los términos oficiales más recientes.</li>
                        <li>Revisa cada resultado antes de confiar en él, publicarlo o actuar en consecuencia.</li>
                        <li>Verifica la información importante en una fuente de confianza.</li>
                    </ul>
                </Callout>

                <h2>Preguntas frecuentes</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <section className="section">
                <div className="ait-guide-cta-card">
                    <h2>Sigue aprendiendo IA</h2>
                    <p>Explora más tutoriales de IA para principiantes, paso a paso, en el centro de Tutoriales de IA de CinNova.</p>
                    <div className="ait-guide-cta-actions">
                        <a className="primary-btn" href="/guides">← Volver a Tutoriales de IA</a>
                        <a className="ait-link-btn" href="/guides/ai-coding">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
