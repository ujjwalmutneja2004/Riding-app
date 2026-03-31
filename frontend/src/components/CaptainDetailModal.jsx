import React, { useState } from 'react';

const CaptainDetailModal = ({ captain, onClose, onApprove, onReject }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    if (!captain) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#010102]/60 backdrop-blur-xl animate-in fade-in duration-300 font-['Inter']">
            <div className="bg-white w-full max-w-[56rem] h-full max-h-[48rem] rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 w-12 h-12 bg-[#efedf2] rounded-full flex items-center justify-center text-[#010102] hover:bg-[#010102] hover:text-white transition-all z-10"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                <div className="flex-1 overflow-y-auto p-12 lg:p-16">
                    <header className="mb-12 flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-[#efedf2] rounded-[2rem] flex items-center justify-center text-3xl font-bold text-[#010102]">
                                {captain.fullname.firstname[0]}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">CAPTAIN PROFILE</h4>
                                <h2 className="text-4xl font-bold text-[#010102] tracking-tight">{captain.fullname.firstname} {captain.fullname.lastname}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="px-3 py-1 bg-[#efedf2] text-[10px] font-bold rounded-full text-gray-500 uppercase">PENDING APPROVAL</span>
                                    <span className="text-sm text-gray-400">{captain.email}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-2 gap-12">
                        {/* Vehicle Details */}
                        <section>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-6 bg-[#7b5900] rounded-full"></span>
                                Vehicle Information
                            </h3>
                            <div className="bg-[#fbf8fd] p-8 rounded-[2rem] border border-[#efedf2] space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Type</p>
                                        <p className="text-lg font-bold text-[#010102] capitalize">{captain.vehicle.vehicleType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plate Number</p>
                                        <p className="text-lg font-bold text-[#010102]">{captain.vehicle.plate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</p>
                                        <p className="text-lg font-bold text-[#010102] capitalize">{captain.vehicle.color}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Capacity</p>
                                        <p className="text-lg font-bold text-[#010102]">{captain.vehicle.capacity} Person</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Documents */}
                        <section className="col-span-2">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-6 bg-[#7b5900] rounded-full"></span>
                                Verification Documents
                            </h3>
                            <div className="grid grid-cols-5 gap-6">
                                <DocCard label="License Front" src={captain.documents?.licenseFront} />
                                <DocCard label="License Back" src={captain.documents?.licenseBack} />
                                <DocCard label="Vehicle RC" src={captain.documents?.rc} />
                                <DocCard label="Number Plate" src={captain.documents?.numberPlate} />
                                <DocCard label="Selfie" src={captain.documents?.selfie} />
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <footer className="p-10 bg-[#fbf8fd] border-t border-[#efedf2] flex items-center justify-between">
                    <div className="flex-1 max-w-sm">
                        {isRejecting && (
                            <input 
                                type="text"
                                placeholder="Enter rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl border-2 border-red-100 bg-white text-sm focus:border-red-400 outline-none animate-in slide-in-from-bottom-2 duration-200"
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {!isRejecting ? (
                            <>
                                <button 
                                    onClick={() => setIsRejecting(true)}
                                    className="px-10 py-4 text-[#ba1a1a] font-bold hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    REJECT
                                </button>
                                <button 
                                    onClick={() => onApprove(captain._id)}
                                    className="px-12 py-4 bg-[#010102] text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    APPROVE CAPTAIN
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setIsRejecting(false)}
                                    className="px-8 py-4 text-gray-500 font-bold"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={() => onReject(captain._id, rejectionReason)}
                                    className="px-12 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl hover:bg-red-700 transition-all"
                                >
                                    CONFIRM REJECTION
                                </button>
                            </>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

const DocCard = ({ label, src }) => (
    <div className="space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">{label}</p>
        <div className="relative group bg-[#fbf8fd] border border-[#efedf2] rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            {src ? (
                <>
                    <img src={src} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#010102]/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                        <a 
                            href={src} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#010102] hover:bg-[#010102] hover:text-white transition-all shadow-xl"
                        >
                            <i className="ri-fullscreen-line text-lg"></i>
                        </a>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                    <i className="ri-image-2-line text-2xl"></i>
                    <span className="text-[8px] font-bold uppercase tracking-widest">Missing</span>
                </div>
            )}
        </div>
    </div>
);

export default CaptainDetailModal;
