import React from 'react';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import TraditionalTemplate from './TraditionalTemplate';
import PhotoFocusedTemplate from './PhotoFocusedTemplate';

/**
 * exportMode: if true, the root div inside each template will use id="biodata-preview"
 * (default). If false (visual preview), a different id is used so html2canvas
 * always targets the correct off-screen element.
 */
export default function TemplateRenderer({ biodata, exportMode = false }) {
  if (!biodata) return null;

  const templateMap = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    traditional: TraditionalTemplate,
    photo: PhotoFocusedTemplate,
  };

  const Component = templateMap[biodata.template] || ClassicTemplate;

  return <Component biodata={biodata} exportMode={exportMode} />;
}
