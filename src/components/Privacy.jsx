export default function Privacy() {
  return (
    <div className="px-6 lg:px-12 py-20 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Política de Privacidad
      </h1>
      
      <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Información que recopilamos
          </h2>
          <p>
            Cuando utilizas el formulario de contacto de adricode.com, recopilamos la siguiente información:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Nombre</li>
            <li>Dirección de correo electrónico</li>
            <li>Mensaje</li>
            <li>Dirección IP (para prevención de spam)</li>
            <li>User Agent del navegador (para prevención de spam)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Cómo utilizamos tu información
          </h2>
          <p>
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Responder a tus consultas y mensajes</li>
            <li>Prevenir spam y abusos del formulario de contacto</li>
            <li>Mantener registros de comunicaciones por motivos de seguridad</li>
          </ul>
          <p className="mt-4">
            <strong>No vendemos, compartimos ni distribuimos tu información personal a terceros</strong> salvo en los siguientes casos:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Cuando sea requerido por ley</li>
            <li>Para proteger nuestros derechos legales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Cookies y tecnologías similares
          </h2>
          <p>
            Este sitio web utiliza:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li><strong>localStorage:</strong> Para guardar tu preferencia de tema (claro/oscuro)</li>
            <li><strong>Cloudflare Turnstile:</strong> Para verificación anti-bot en el formulario de contacto</li>
          </ul>
          <p className="mt-4">
            No utilizamos cookies de seguimiento ni analíticas de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Seguridad
          </h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Limitación de intentos (rate limiting) para prevenir abusos</li>
            <li>Verificación anti-bot con Cloudflare Turnstile</li>
            <li>Sanitización de datos para prevenir inyecciones</li>
            <li>Conexiones HTTPS cifradas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Tus derechos
          </h2>
          <p>
            Según el RGPD (Reglamento General de Protección de Datos), tienes derecho a:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
            <li>Acceder a tus datos personales</li>
            <li>Rectificar datos incorrectos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Oponerte al tratamiento de tus datos</li>
            <li>Solicitar la limitación del tratamiento</li>
            <li>Portabilidad de datos</li>
          </ul>
          <p className="mt-4">
            Para ejercer cualquiera de estos derechos, contacta conmigo en:{' '}
            <a href="mailto:dev@adricode.com" className="text-purple-600 dark:text-purple-400 hover:underline">
              dev@adricode.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Retención de datos
          </h2>
          <p>
            Los mensajes del formulario de contacto se conservan durante el tiempo necesario para responder a tu consulta
            y un período razonable posterior para fines de archivo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. Enlaces externos
          </h2>
          <p>
            Este sitio puede contener enlaces a sitios externos (GitHub, LinkedIn, etc.). No somos responsables
            de las prácticas de privacidad de estos sitios. Te recomendamos leer sus políticas de privacidad.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Cambios en esta política
          </h2>
          <p>
            Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos cualquier cambio
            significativo publicando la nueva política en esta página con una fecha de actualización.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Contacto
          </h2>
          <p>
            Si tienes preguntas sobre esta política de privacidad, puedes contactarme en:
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