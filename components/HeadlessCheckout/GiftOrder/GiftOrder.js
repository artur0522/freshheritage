import { useState, useEffect } from 'react'
import { InputField } from '../InputField';

// TODO: on process order, update metaorder data for these values
  // if is not gift order, do not process gift properties

const GiftNote = ({ orderMetaData, updateOrderMetaData }) => {
  const { note_attributes } = orderMetaData

  const [email, setEmail] = useState(note_attributes.recipient_email || '')
  const [name, setName] = useState(note_attributes.recipient_name || '')
  const [message, setMessage] = useState(note_attributes.gift_message || '')

  useEffect(() => {
    setEmail(orderMetaData.note_attributes.recipient_email || '')
    setName(orderMetaData.note_attributes.recipient_name || '')
    setMessage(orderMetaData.note_attributes.gift_message || '')
  }, [orderMetaData])

  return (
    <div className="order-giftnote-form">
      <div className="input-group--wrapper">
        <InputField
          className="input"
          placeholder="recipient@email.com"
          type="email"
          name="recipient_email"
          autoComplete="email"
          label="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => updateOrderMetaData({
            note_attributes: {
              recipient_email: email,
              recipient_name: name,
              gift_message: message
            }
          })}
        />
        <InputField
          className="input"
          placeholder="Recipient Name"
          type="text"
          name="recipient_name"
          label="Recipient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => updateOrderMetaData({
            note_attributes: {
              recipient_email: email,
              recipient_name: name,
              gift_message: message
            }
          })}
        />
      </div>
      <InputField
        className="input"
        placeholder="gift message"
        type="textarea"
        name="gift_message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onBlur={() => updateOrderMetaData({
            note_attributes: {
              recipient_email: email,
              recipient_name: name,
              gift_message: message
            }
          })}
      />
      <p className="order-giftnote-disclaimer">*We will alert the recipient of their delivery via email one week before they receive it, and include your gift message along with delivery information!</p>
    </div>
  );
};

export default GiftNote;