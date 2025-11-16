import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageModal = ({ imageUrl, productName, open, onOpenChange }: ImageModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-[95vh] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={productName}
            className="max-w-full max-h-full object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;

