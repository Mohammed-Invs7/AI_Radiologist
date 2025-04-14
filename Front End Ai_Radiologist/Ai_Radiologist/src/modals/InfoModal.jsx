import { motion } from 'framer-motion';

const InfoModal = ({ show, user, onClose, onSave, loading, onChange, previewImage }) => {
    if (!show) return null;

    return (
        
        <motion.div 
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={onSave}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Personal Info</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex align-items-center flex-column">
                                {previewImage && (
                                    <div className="mb-3 text-center align-items-center rounded-circle border border-dark bg-white shadow" style={{ width: '120px', height: '120px' }}>
                                        <img src={previewImage} alt="Profile Preview" className="rounded-circle" style={{ width: '118px', height: '118px', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <label className="custom-upload-button">
                                    Change your Image
                                    <input
                                        type="file"
                                        className="hidden-file-input"
                                        name="profile_image"
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                </label>
                            </div>

                            <div className="mb-3">
                                <label>First Name</label>
                                <motion.input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={user.first_name}
                                    onChange={onChange}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Last Name</label>
                                <motion.input
                                    type="text"
                                    className="form-control"
                                    name="last_name"
                                    value={user.last_name}
                                    onChange={onChange}
                                    required
                                    whileFocus={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Gender</label>
                                <select
                                    className="form-control"
                                    name="gender"
                                    value={user.gender}
                                    onChange={onChange}
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-center align-items-center text-center">
                            <motion.button
                                type="submit"
                                className="btn btn-primary w-75"
                                disabled={loading}
                                whileHover={{ scale: 1.1 }}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoModal;
