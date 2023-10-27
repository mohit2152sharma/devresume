import { memo, useCallback, useEffect, useRef } from "react";
import { DoubleBuffered } from "./double-buffered";
import useResizeObserver from "@react-hook/resize-observer";
import "./pdf.css";

type Props = {
  blob: Blob | null;
  scale: number;
};

function UnmemoizedPDF({ blob, scale }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef(0);

  const update = useCallback(() => {
    if (!ref.current) return;

    const viewportWidth = widthRef.current;
    const pageWidth = scale * 595;
    const d = Math.abs((pageWidth - viewportWidth) / 2);
    const viewportNode = ref.current;

    if (pageWidth > viewportWidth) {
      viewportNode.style.setProperty("--left", "0px");
      viewportNode.scroll(d, 0);
    } else {
      viewportNode.style.setProperty("--left", `${d}px`);
    }
  }, [scale]);

  useEffect(() => {
    update();
  }, [scale, update]);

  useResizeObserver(ref, (entry) => {
    if (ref.current) {
      widthRef.current = entry.contentRect.width;
      update();
    }
  });

  return (
    <div ref={ref} data-testid="pdf" className="PDF">
      <DoubleBuffered blob={blob} scale={scale} />
    </div>
  );
}

export const PDF = memo(UnmemoizedPDF);
