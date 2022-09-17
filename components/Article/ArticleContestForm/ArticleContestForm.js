import { useState, useEffect, useRef, createRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import moment from 'moment'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContestForm.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import ResponsiveImage from '@/components/ResponsiveImage'
import IconUpload from '@/svgs/upload.svg'
import IconBullet from '@/svgs/list-item.svg'
import IconClose from '@/svgs/close.svg'
import axios from 'axios';
import useFileUpload from 'react-use-file-upload';

const ArticleContestForm = ({fields}) => {

  fields = {
    title: fields.title,
    ...fields.fields
  }

  const { contestForm } = fields
  const [mounted, setMounted] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [checkboxChecked, setCheckboxCheck] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  const {
    files,
    fileNames,
    setFiles,
    removeFile,
  } = useFileUpload();

  const uploadInputRef = useRef()

  const refs = ['first_name', 'last_name', 'email', 'phone', 'recipe_name', 'recipe_info']

  const formRef = useRef(refs.reduce((carry, ref) => {
    return {
      ...carry,
      [ref]: createRef()
    }
  }, {}))

  const endDateTextFormatted = moment(fields.formEndDate).format('MMMM DD, h:mm a')

  const unixNowDate = moment().unix()
  const unixEndDate = moment(fields.formEndDate).unix()

  const onSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData();

    for (const file of files) {
      formData.append(file.name, file);
    }

    for (const keyName of Object.keys(formRef.current)) {
      const value = formRef.current[keyName].current.value
      formData.append(keyName, value)
    }

    axios.post('/api/culinary-contest/submit-form', formData, {
      'content-type': 'multipart/form-data'
    })
    .then(({data}) => {
      if (data.message === 'success') {
        setFormSubmitted(true)
      }
    })

  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="culinary-contest-article">
      <div className={classes['culinary-contest-article__navigation']}>
        <Link href="/blogs/culinary">
          <a><IconBullet /> <span>Back to all culinary</span></a>
        </Link>
      </div>
      <div className={classes['contest-form']}>
        <div className={classes['contest-form__header']}>
          <h1>{fields.title}</h1>
          <h2>{fields.subheader}</h2>
        </div>
        <div className={classes['contest-form__form']}>
          <div className={classes['contest-form__hero']}>
            {contestForm?.heroImage && isMobile && mounted &&
              <ResponsiveImage
                priority={true}
                src={contestForm?.heroImage.asset.url}
                alt={contestForm?.heroImage.alt || ''}
              />}
            {contestForm?.heroImage && isDesktop && mounted &&
              <Image
                priority={true}
                sizes="(min-width: 1080px) 75vw, (min-width: 1400px) 1200px"
                src={contestForm?.heroImage.asset.url}
                layout="fill"
                alt={contestForm?.heroImage.alt || ''}
              />
            }
          </div>

          {formSubmitted ? (
            <div className={classes['contest-form__panel']}>
              <h4>Submission sent! Thank you for participating!</h4>
            </div>
          ):(unixNowDate > unixEndDate) ? (
            <div className={classes['contest-form__panel']}>
              <h4>Submission deadline has passed. Thank you for participating!</h4>
            </div>
          ):(
            <div className={classes['contest-form__panel']}>
              <h4>Submissions Close <span>{endDateTextFormatted}</span></h4>
              <div className={classes['contest-form__description']}>
                <PortableText value={fields.contestForm.content || {}} />
              </div>
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="input-group--wrapper">
                  <div className="input-group">
                    <label className="label label--block secondary--body">First Name</label>
                    <input className="input" type="text" placeholder="First Name" ref={formRef.current.first_name} required />
                  </div>
                  <div className="input-group">
                    <label className="label label--block secondary--body">Last Name</label>
                    <input className="input" type="text" placeholder="Last Name" ref={formRef.current.last_name} required />
                  </div>
                </div>
                <div className="input-group--wrapper">
                  <div className="input-group">
                    <label className="label label--block secondary--body">Email Address</label>
                    <input className="input" type="email" placeholder="Email Address" ref={formRef.current.email} required />
                  </div>
                  <div className="input-group">
                    <label className="label label--block secondary--body">Phone Number</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Phone Number"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      ref={formRef.current.phone}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="label label--block secondary--body">Recipe Name</label>
                  <input className="input" type="text" placeholder="Recipe Name" ref={formRef.current.recipe_name} required />
                </div>

                <div className="input-group">
                  <label className="label label--block secondary--body">Your Recipe</label>
                  <textarea className="textarea" type="text" placeholder="Include your recipe, ingredients and steps." ref={formRef.current.recipe_info} required />
                </div>

                {!!fileNames.length && <ul className={classes['contest-form__file-list']}>
                  {fileNames.map((name) => (
                    <li className={classes['contest-form__file-item']} key={name}>
                      <span>{name}</span>
                      <button onClick={() => removeFile(name)}>
                        <IconClose />
                      </button>
                    </li>
                  ))}
                </ul>}

                <div className={`${classes['contest-form__upload']} ${classes['contest-form__btn-item']}`}>
                  <button onClick={(e) => {
                      e.preventDefault()
                      uploadInputRef.current.click()
                    }} className="btn sitkablue">
                    <IconUpload />
                    <span>Upload Photo or Video</span>
                  </button>
                </div>


                {/* Hide the crappy looking default HTML input */}
                <input
                  ref={uploadInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    setFiles(e, 'a');
                    uploadInputRef.current.value = null;
                  }}
                />

                <div className={`${classes['contest-form__submit']} ${classes['contest-form__btn-item']}`}>
                  <button className="btn salmon" disabled={!checkboxChecked}>Submit Your Entry</button>
                  <div className="input-group input-group--checkbox">
                    <input className="input" type="checkbox" onChange={() => setCheckboxCheck(!checkboxChecked)} />
                    <label>I have read and understood te terms & conditions.</label>
                  </div>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ArticleContestForm