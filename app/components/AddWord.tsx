import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function AddWord() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-[#fcd267] border border-[#9d740c] rounded-full px-4 py-4 w-auto text-center text-[#9d740c] font-medium hover:bg-[#e6b538]/90 transition">
          <i className="ri-add-line mr-1" />
          Tambah Kata
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Kata Baru</DialogTitle>
          <DialogDescription>
            Masukkan kata baru beserta maknanya di sini.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 mt-4">
          <input
            type="text"
            placeholder="Apa Kata Upay?"
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="text"
            placeholder="Artinya"
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Batal
            </Button>
          </DialogClose>
          <Button className="cursor-pointer">Tambah</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
