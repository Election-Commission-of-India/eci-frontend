import { useDispatch, useSelector } from "react-redux";
import FormSectionCard from "../form6/FormSectionCard";
import { useEffect } from "react";
import {
  setAssemblies,
  setError,
  setLoading,
  setPollingStations,
  updateField,
} from "../../store/slices/form8slice";
import { locationApis } from "../../services/locationApis";
import { toast } from "react-toastify";
import Loading from "../Loading";

export default function LocationSection() {
  const form8Data = useSelector((state) => state.form8); // ← Form 8 data
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const assemblies = await locationApis.fetchAssemblyStation();
        const pollingStations = await locationApis.fetchPollingStation();
        dispatch(setAssemblies(assemblies));
        dispatch(setPollingStations(pollingStations));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setError("Error fetching location data" + error));
        toast.error("Error loading locations");
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [dispatch]);

  if (form8Data.isLoading) {
    return <Loading />;
  }
  if (!form8Data.voterDetails) {
  return null;
}

  if (form8Data.error) {
    return (
      <FormSectionCard title="Location Details">
        <div className="border rounded p-4 bg-red-50">
          <p className="text-red-600">Error: {form8Data.error}</p>
        </div>
      </FormSectionCard>
    );
  }

  return (
    <FormSectionCard title="Location Details">
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">Select Location</h2>

        <select
          required
          className="input"
          value={form8Data.assemblyConstituencyId || ""}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "assemblyConstituencyId",
                value: Number(e.target.value),
              }),
            )
          }
        >
          <option value="">Select Assembly Constituency</option>
          {form8Data.assemblies.map((assembly) => (
            <option key={assembly.id} value={assembly.id}>
              {assembly.constituencyName}
            </option>
          ))}
        </select>

        <select
          required
          className="input mt-2"
          value={form8Data.pollingStationId || ""}
          onChange={(e) =>
            dispatch(
              updateField({
                fieldName: "pollingStationId",
                value: Number(e.target.value),
              }),
            )
          }
        >
          <option value="">Select Polling Station</option>
          {form8Data.pollingStations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.stationName}
            </option>
          ))}
        </select>
      </div>
    </FormSectionCard>
  );
}
