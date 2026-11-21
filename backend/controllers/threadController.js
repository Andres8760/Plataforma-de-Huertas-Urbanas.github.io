const Thread = require('../models/Thread');

exports.getThreads = async (req, res) => {
  try {
    const threads = await Thread.find().sort({ fechaCreacion: -1 });
    res.status(200).json({ success: true, data: threads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener hilos', error: error.message });
  }
};

exports.createThread = async (req, res) => {
  try {
    const newThread = await Thread.create(req.body);
    res.status(201).json({ success: true, data: newThread });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al crear el hilo', error: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { autor, mensaje } = req.body;
    const thread = await Thread.findByIdAndUpdate(
      id,
      { $push: { respuestas: { autor, mensaje } } },
      { new: true, runValidators: true }
    );
    if (!thread) return res.status(404).json({ success: false, message: 'Hilo no encontrado' });
    res.status(200).json({ success: true, data: thread });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error al responder', error: error.message });
  }
};
