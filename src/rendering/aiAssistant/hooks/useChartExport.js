import { toast } from '@/components/toast';

export function useChartExport({
    chartRef,
    activeSymbolClean,
    onAttachScreenshot,
    setCameraDropdownOpen
}) {
    const downloadChartImage = () => {
        if (!chartRef.current) return;
        const canvas = chartRef.current.takeScreenshot();
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${activeSymbolClean}_chart.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast('Chart downloaded as ' + activeSymbolClean + '_chart.png');
        if (setCameraDropdownOpen) setCameraDropdownOpen(false);
    };

    const copyChartImageToClipboard = () => {
        if (!chartRef.current) return;
        const canvas = chartRef.current.takeScreenshot();
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob }),
                ]);
                toast('Chart screenshot copied to clipboard!');
            } catch (err) {
                console.error('Copy screenshot error:', err);
                toast('Could not copy image to clipboard.');
            }
        });
        if (setCameraDropdownOpen) setCameraDropdownOpen(false);
    };

    const attachChartToChat = () => {
        if (!chartRef.current) return;
        const canvas = chartRef.current.takeScreenshot();
        const dataUrl = canvas.toDataURL('image/png');
        if (onAttachScreenshot) {
            onAttachScreenshot({
                name: `${activeSymbolClean}_chart.png`,
                url: dataUrl,
                type: 'image/png',
            });
            toast('Chart screenshot attached to chat message!');
        } else {
            toast('Chart screenshot captured!');
        }
        if (setCameraDropdownOpen) setCameraDropdownOpen(false);
    };

    return {
        downloadChartImage,
        copyChartImageToClipboard,
        attachChartToChat
    };
}
