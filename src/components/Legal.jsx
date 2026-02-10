export default function Legal() {
  return (
    <div className="px-6 lg:px-12 py-20 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Aviso Legal
      </h1>
      
      <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Datos identificativos
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="mb-2"><strong className="text-gray-900 dark:text-white">Sitio web:</strong> adricode.com</p>
            <p className="mb-2"><strong className="text-gray-900 dark:text-white">Email de contacto:</strong>{' '}
              <a href="mailto:dev@adricode.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                dev@adricode.com
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Objeto
          </h2>
          <p>
            El presente aviso legal regula el uso del sitio web adricode.com (en adelante, "el Sitio Web").
            La navegación por el Sitio Web atribuye la condición de usuario del mismo e implica la aceptación
            plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Finalidad del sitio web
          </h2>
          <p>
            Este sitio web es un portfolio personal destinado a mostrar proyectos, habilidades y experiencia
            profesional en desarrollo web. El contenido tiene carácter meramente informativo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Propiedad intelectual e industrial
          </h2>
          <p>
            Todos los contenidos del Sitio Web (textos, imágenes, código fuente, diseño gráfico, estructura, etc.)
            son propiedad de Adrián Pérez o se cuenta con la correspondiente autorización para su uso.
          </p>
          <p className="mt-4">
            Quedan reservados todos los derechos de propiedad intelectual e industrial. Queda prohibida la reproducción,
            distribución, comunicación pública y transformación de los contenidos sin la autorización expresa del titular.
          </p>
          <p className="mt-4">
            El código fuente de algunos proyectos puede estar disponible en GitHub bajo licencias específicas
            que se indican en cada repositorio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Uso del sitio web
          </h2>
          <p>
            El usuario se compromete a hacer un uso adecuado y lícito del Sitio Web. En particular, el usuario se compromete a:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>No utilizar el Sitio Web con fines ilegales o contrarios a la buena fe</li>
            <li>No intentar acceder a áreas restringidas o vulnerar las medidas de seguridad</li>
            <li>No causar daños al Sitio Web o a sus contenidos</li>
            <li>No introducir virus o código malicioso</li>
            <li>No realizar actividades de spam o phishing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Enlaces externos
          </h2>
          <p>
            El Sitio Web puede contener enlaces a sitios web de terceros (GitHub, LinkedIn, proyectos externos, etc.).
            No nos hacemos responsables del contenido de estos sitios ni de las políticas de privacidad que apliquen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. Limitación de responsabilidad
          </h2>
          <p>
            El titular del Sitio Web no se hace responsable de:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Fallos técnicos o interrupciones del servicio</li>
            <li>Errores u omisiones en los contenidos</li>
            <li>Daños causados por virus u otros elementos maliciosos introducidos por terceros</li>
            <li>El uso indebido que terceros puedan hacer del Sitio Web</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Modificaciones
          </h2>
          <p>
            El titular se reserva el derecho a modificar, en cualquier momento y sin previo aviso, la presentación
            y configuración del Sitio Web, así como el presente Aviso Legal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Legislación aplicable y jurisdicción
          </h2>
          <p>
            Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier
            controversia que pudiera surgir en relación con el Sitio Web, las partes se someten a los juzgados
            y tribunales del domicilio del titular.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            10. Contacto
          </h2>
          <p>
            Para cualquier consulta relacionada con este Aviso Legal, puedes ponerte en contacto a través de:
          </p>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white">Adrián Pérez</p>
            <p>Email: <a href="mailto:dev@adricode.com" className="text-purple-600 dark:text-purple-400 hover:underline">dev@adricode.com</a></p>
            <p>Web: <a href="https://adricode.com" className="text-purple-600 dark:text-purple-400 hover:underline">adricode.com</a></p>
          </div>
        </section>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-500">
          <p>Última actualización: Febrero 2026</p>
        </div>
      </div>
    </div>
  );
}