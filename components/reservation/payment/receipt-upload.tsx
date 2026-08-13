"use client";

import { ImagePlus, Loader2, Upload } from "lucide-react";

import { formatFileSize } from "@/lib/reservation/reservation-utils";

type ReceiptUploadProps = {
  receipt: File | null;

  error: string | null;

  isUploading: boolean;

  onSelect: (file: File | null) => void;

  onRemove: () => void;

  onUpload: () => void;
};

export function ReceiptUpload({
  receipt,
  error,
  isUploading,
  onSelect,
  onRemove,
  onUpload,
}: ReceiptUploadProps) {
  return (
    <div className="mt-7">
      <p className="text-sm font-semibold text-[#263A2D]">Ödeme Dekontu</p>

      <p className="mt-1 text-xs leading-5 text-[#8A8E88]">
        JPG, PNG, WEBP veya PDF. Maksimum 10 MB.
      </p>

      <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-[#CBC7BE] bg-[#FAF9F6] p-4 text-center transition hover:border-[#A8754F]">
        <ImagePlus size={27} className="text-[#A8754F]" />

        <p className="mt-3 max-w-full break-all text-xs font-semibold text-[#263A2D]">
          {receipt ? receipt.name : "Dekont Seç"}
        </p>

        <p className="mt-1 text-[10px] text-[#969990]">
          Telefonunuzdan fotoğraf veya PDF seçebilirsiniz.
        </p>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          disabled={isUploading}
          className="hidden"
          onChange={(event) => {
            onSelect(event.target.files?.[0] ?? null);

            event.currentTarget.value = "";
          }}
        />
      </label>

      {receipt && (
        <div className="mt-3 flex items-center justify-between gap-3 border border-[#E4E1D9] bg-[#F7F6F2] px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[#263A2D]">
              {receipt.name}
            </p>

            <p className="mt-1 text-[10px] text-[#969990]">
              {formatFileSize(receipt.size)}
              MB
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={onRemove}
            className="shrink-0 text-[10px] font-semibold text-[#98584E] disabled:opacity-50"
          >
            Kaldır
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs leading-5 text-[#98584E]">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!receipt || isUploading}
        onClick={onUpload}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Dekont Gönderiliyor...
          </>
        ) : (
          <>
            <Upload size={16} />
            Ödemeyi Tamamla ve Dekontu Gönder
          </>
        )}
      </button>
    </div>
  );
}
