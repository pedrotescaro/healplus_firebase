export async function fileToDataUri(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
// Código duplicado removido e função corrigida.
// O bloco correto já está implementado acima.
}
