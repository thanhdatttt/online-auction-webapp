import { useUserStore } from "../../../stores/useUser.store.js";

const ChangeModalLayout = ({open, onClose, onSubmit, title, children}) => {
  const {loading} = useUserStore();

  // handle when click backdrop
  const handleBackdropClick = () => {
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      {/* stop propagation of handle close function when click inside modal */}
      <div onClick={(e) => e.stopPropagation()} className="bg-light font-lora w-80 md:w-200 p-6 rounded-md shadow-lg animate-fadeIn">
        {/* title */}
        <h2 className="text-4xl font-semibold mb-4">{title}</h2>

        <form onSubmit={onSubmit}>
          {/* content injected from outside */}
          <div className="space-y-4">
            {children}
          </div>

          {/* buttons */}
          <div className="flex items-center justify-between mt-6">
            <button type="submit" disabled={loading} className="bg-primary text-xl text-lighter px-4 py-2 rounded hover:bg-accent hover:text-black transition cursor-pointer disabled:bg-accent disabled:text-amber-50">Save change</button>
            <button type="button" onClick={onClose} className="text-primary text-xl hover:underline cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeModalLayout;