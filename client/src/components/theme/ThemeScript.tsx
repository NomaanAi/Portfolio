export const ThemeScript = () => {
  const code = `(function() {
    try {
      var saved = localStorage.getItem('theme');
      var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = saved || system;
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })()`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
};
