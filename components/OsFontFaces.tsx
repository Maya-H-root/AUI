import { getBasePath } from "@/lib/basePath";

function fontCss(prefix: string) {
  const b = `${prefix}/fonts`;
  return `
@font-face{font-family:'SF Pro Display';src:url('${b}/sf-pro/SFPRODISPLAYREGULAR.OTF')format('opentype');font-weight:400;font-style:normal;font-display:swap;}
@font-face{font-family:'SF Pro Display';src:url('${b}/sf-pro/SFPRODISPLAYMEDIUM.OTF')format('opentype');font-weight:500;font-style:normal;font-display:swap;}
@font-face{font-family:'SF Pro Display';src:url('${b}/sf-pro/SFPRODISPLAYBOLD.OTF')format('opentype');font-weight:700;font-style:normal;font-display:swap;}
@font-face{font-family:'SamsungOne';src:url('${b}/samsung-one/SamsungOne-400.ttf')format('truetype');font-weight:400;font-style:normal;font-display:swap;}
@font-face{font-family:'SamsungOne';src:url('${b}/samsung-one/SamsungOne-700.ttf')format('truetype');font-weight:700;font-style:normal;font-display:swap;}
`.replace(/\s+/g, " ");
}

export function OsFontFaces() {
  const prefix = getBasePath();
  return (
    <style
      // eslint-disable-next-line react/no-danger -- build-time font URLs need basePath
      dangerouslySetInnerHTML={{ __html: fontCss(prefix) }}
    />
  );
}
