import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Error from  "../components/Error"
import MissingDraw from  "../components/MissingDraw"
import Loading from  "../components/Loading"
import { useIntl, navigate } from "gatsby-plugin-intl"
import { getBoardDetails, addUser } from '../services/board';

const NewMemberPage = ({ location }) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [boardName, setBoardName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDraw, setIsDraw] = useState('');
  const [error, setError] = useState(false);
  const [lid, setLid] = useState();
  const [textAreaLines, setTextAreaLines] = useState(2);

  //TODO: getBoardDetails with isDraw functionality
  useEffect(() => {
    const lidMatch = location.search.match(/lid=([^&]*)/);
    if(lidMatch) {
      setLid(lidMatch[1])
      getBoardDetails(lidMatch[1])
      .then((details) => {
        setBoardName(details.name);
        setIsDraw(details.isDraw);
      })
      .catch(() => {
        setError(true);
      })
      .finally(()=> {
        setIsPageLoading(false);
      });
    }
  }, [location]);

  const onAddUser = () => {
    setIsLoading(true);
    addUser(lid, name, description)
    .then((uid) => navigate('/member?lid='+lid+'&uid='+uid))
    .catch(() => {
      setIsDraw(true);
      setIsLoading(false);
    })
  }

  const onSetDescription = (value) => {
    const countLine = (value.match(/\n/g) || []).length;
    if(countLine >= 1) {
      setTextAreaLines(countLine + 1);
    }
    setDescription(value);
  }

  if(isPageLoading || isLoading) return <Loading />
  if(isDraw) return <MissingDraw />
  if(!lid || error) return <Error />;

  return (<Layout>
    <SEO title={intl.formatMessage({ id: "new_member" })} />
    <h1>{boardName}</h1>
    <form onSubmit={(e) => {e.preventDefault(); name !== '' && onAddUser()}}>
      <input placeholder={intl.formatMessage({ id: "nm_your_name" })} value={name} onChange={(e) => setName(e.target.value) } />
      <textarea
        type="text"
        rows={textAreaLines}
        placeholder={intl.formatMessage({ id: "nm_dear_santa" })}
        value={description}
        onChange={(e) => onSetDescription(e.target.value) } />
      {name && <button disabled={name === ''} type="submit">{intl.formatMessage({ id: "nm_send_letter" })}</button>}
    </form>
  </Layout>
)}


export default NewMemberPage
