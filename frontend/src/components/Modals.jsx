import React from "react";

export default function Modals({ 
  errorModal, 
  setErrorModal, 
  confirmModal, 
  setConfirmModal, 
  successModal, 
  setSuccessModal, 
  popupMessage, 
  handleConfirmSubmission, 
  navigate 
}) {
  console.log("🔍 Modals Props Updated:", { errorModal, confirmModal, successModal });

  return (
    <div>
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Submission</h3>
            <p className="py-4">{popupMessage}</p>
            <div className="modal-action">
              <button className="btn btn-success" onClick={handleConfirmSubmission}>Confirm</button>
              <button className="btn btn-error" onClick={() => setConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold text-red-500">Error</h3>
            <p className="py-4">{popupMessage}</p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={() => setErrorModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Submission Successful</h3>
            <p>Your results will be displayed on the next page.</p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={() => navigate(`/results`)}>
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
