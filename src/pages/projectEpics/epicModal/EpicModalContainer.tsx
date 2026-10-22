import EpicModal from "./EpicModal";
import { useSelectedEpicStore } from "../../../stores/useProjectStore";

const EpicModalContainer = () => {
  const selectedEpic = useSelectedEpicStore((state) => state.selectedEpic);

  const clearSelectedEpic = useSelectedEpicStore(
    (state) => state.clearSelectedEpic,
  );

  if (!selectedEpic) return null;

  return (
    <EpicModal
      isOpen={true}
      selectedEpicId={selectedEpic.epic_id}
      onClose={clearSelectedEpic}
    />
  );
};

export default EpicModalContainer;
