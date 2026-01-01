"use client"

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BoundingBoxSelectorProps {
    imageUrl: string;
    onBoundingBoxChange: (box: BoundingBox | null) => void;
    initialBox?: BoundingBox | null;
}

export function BoundingBoxSelector({ imageUrl, onBoundingBoxChange, initialBox = null }: BoundingBoxSelectorProps) {
    const [box, setBox] = useState<BoundingBox | null>(initialBox);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({x: 0, y: 0});
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Prevent all default drag behavior globally when component mounts
        const preventDrag = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const preventContextMenu = (e: MouseEvent) => {
            if (containerRef.current?.contains(e.target as Node)) {
                e.preventDefault();
            }
        };

        document.addEventListener('dragstart', preventDrag, true);
        document.addEventListener('drag', preventDrag, true);
        document.addEventListener('dragover', preventDrag, true);
        document.addEventListener('contextmenu', preventContextMenu, true);

        return () => {
            document.removeEventListener('dragstart', preventDrag, true);
            document.removeEventListener('drag', preventDrag, true);
            document.removeEventListener('dragover', preventDrag, true);
            document.removeEventListener('contextmenu', preventContextMenu, true);
        };
    }, []);

    const getRelativePos = (e: React.MouseEvent | MouseEvent): { x: number; y: number } => {
        const container = containerRef.current;
        if (!container) {
            console.log('No container ref');
            return {x: 0, y: 0};
        }

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        return {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();

        const pos = getRelativePos(e);
        if (box) {
            const inBox =
                pos.x >= box.x &&
                pos.x <= box.x + box.width &&
                pos.y >= box.y &&
                pos.y <= box.y + box.height;

            if (inBox) {
                setIsDragging(true);
                setStartPos({x: pos.x - box.x, y: pos.y - box.y});
                return;
            }
        }

        setIsDrawing(true);
        setStartPos(pos);
        setBox({x: pos.x, y: pos.y, width: 0, height: 0});
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing && !isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const pos = getRelativePos(e);

        if (isDrawing) {
            // Drawing new box
            const width = pos.x - startPos.x;
            const height = pos.y - startPos.y;

            setBox({
                x: width < 0 ? pos.x : startPos.x,
                y: height < 0 ? pos.y : startPos.y,
                width: Math.abs(width),
                height: Math.abs(height)
            });
        } else if (isDragging && box) {
            // Dragging existing box
            const newX = Math.max(0, Math.min(100 - box.width, pos.x - startPos.x));
            const newY = Math.max(0, Math.min(100 - box.height, pos.y - startPos.y));

            setBox({
                ...box,
                x: newX,
                y: newY
            });
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsDragging(false);

        if (box && box.width > 1 && box.height > 1) {
            onBoundingBoxChange(box);
        }
    };

    const handleClearBox = () => {
        setBox(null);
        onBoundingBoxChange(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium">Mouth Region Selection (Optional)</h3>
                    <p className="text-xs text-muted-foreground">
                        Click and drag to define the mouth region, or leave empty for automatic detection
                    </p>
                </div>
                {box && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClearBox}
                        className="h-8"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Clear Region
                    </Button>
                )}
            </div>

            <div
                ref={containerRef}
                className="relative cursor-crosshair overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/20 select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDragStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
                onDrag={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
            >
                {/* Use a div with background image instead of img tag */}
                <div
                    ref={imgRef as any}
                    className="w-full select-none"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        aspectRatio: 'auto',
                        minHeight: '400px',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                    } as React.CSSProperties}
                >
                    {/* Hidden img for loading detection */}
                    <img
                        src={imageUrl}
                        alt=""
                        style={{ display: 'none' }}
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            const container = imgRef.current;
                            if (container && img.naturalWidth && img.naturalHeight) {
                                const aspectRatio = img.naturalWidth / img.naturalHeight;
                                (container as HTMLDivElement).style.aspectRatio = `${aspectRatio}`;
                            }
                        }}
                    />
                </div>

                {box && box.width > 0 && box.height > 0 && (
                    <div
                        className="absolute border-2 border-accent bg-accent/20 pointer-events-none"
                        style={{
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            width: `${box.width}%`,
                            height: `${box.height}%`,
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded bg-accent/90 px-2 py-1 text-xs font-medium text-white shadow-sm">
                                Mouth Region
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {box && box.width > 1 && box.height > 1 && (
                <div className="rounded-lg border border-border/50 bg-accent/5 p-3">
                    <p className="text-xs text-muted-foreground">
                        <strong>Region defined:</strong> {box.width.toFixed(1)}% × {box.height.toFixed(1)}% at (
                        {box.x.toFixed(1)}%, {box.y.toFixed(1)}%)
                    </p>
                </div>
            )}
        </div>
    );
}
