export async function printHtmlDocument(input: {
  htmlDocument: string;
  title: string;
  printWindow?: Window | null;
}) {
  const printWindow = input.printWindow ?? window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open the browser print window.');
  }

  await new Promise<void>((resolve, reject) => {
    let completed = false;

    const finish = () => {
      if (completed) return;
      completed = true;
      resolve();
    };

    const fail = () => {
      if (completed) return;
      completed = true;
      reject(new Error('Could not prepare the print document.'));
    };

    const cleanupAndClose = () => {
      printWindow.close();
    };

    const autoPrintScript = `
      <script>
        (() => {
          let printStarted = false;

          const triggerPrint = () => {
            if (printStarted) return;
            printStarted = true;

            window.setTimeout(() => {
              try {
                window.focus();
                window.print();
              } catch {}
            }, 100);
          };

          window.addEventListener('load', () => {
            const fonts = document.fonts;
            if (fonts && fonts.ready) {
              fonts.ready.then(triggerPrint, triggerPrint);
              return;
            }
            triggerPrint();
          });

          window.addEventListener('afterprint', () => {
            window.close();
          });

          window.setTimeout(triggerPrint, 1500);
        })();
      </` + `script>
    `;
    const printableHtml = input.htmlDocument.includes('</body>')
      ? input.htmlDocument.replace('</body>', `${autoPrintScript}</body>`)
      : `${input.htmlDocument}${autoPrintScript}`;

    const doc = printWindow.document;
    doc.open();
    doc.write(printableHtml);
    doc.close();
    printWindow.document.title = input.title;
    try {
      printWindow.history.replaceState({}, '', '/print-export');
    } catch {
      // Ignore environments where the popup URL cannot be rewritten.
    }
    finish();

    printWindow.setTimeout(() => {
      if (!printWindow.closed && printWindow.document.body?.childElementCount === 0) {
        cleanupAndClose();
        fail();
      }
    }, 10000);
  });
}
