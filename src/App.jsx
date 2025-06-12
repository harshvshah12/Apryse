import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

const App = () => {
  const viewerDiv = useRef(null);
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [destType, setDestType] = useState('page');
  const [pageNum, setPageNum] = useState(1);
  const [x, setX] = useState(100);
  const [y, setY] = useState(500);

  useEffect(() => {
    WebViewer({
      path: '/webviewer/lib',
      initialDoc: '/files/PDFTRON_about.pdf',
    }, viewerDiv.current).then(instance => {
      const { UI, documentViewer } = instance;

      UI.setHeaderItems(header => {
        header.push({
          type: 'actionButton',
          title: 'Add Coordinate Bookmark',
          img: 'https://img.icons8.com/ios-filled/24/marker.png',
          onClick: () => {
            setPageNum(documentViewer.getCurrentPage());
            setOpenForm(true);
          },
        });
      });

      viewerDiv.current.instance = instance;
    });
  }, []);

  const handleAddBookmark = async () => {
    const { documentViewer, UI } = viewerDiv.current.instance;

    const pdfDoc = await documentViewer.getDocument().getPDFDoc();
    await pdfDoc.lock();

    const page = await pdfDoc.getPage(destType === 'page'
      ? Number(pageNum)
      : documentViewer.getCurrentPage());

    const destination = destType === 'page'
      ? await pdfDoc.createDestination(page, 0, 0, 1)
      : await pdfDoc.createDestination(page, Number(x), Number(y), 2.0);

    const bookmark = await pdfDoc.createBookmark(title || 'Outline');
    bookmark.setAction(await pdfDoc.createGoToAction(destination));
    pdfDoc.addRootBookmark(bookmark);
    await pdfDoc.unlock();

    UI.openElements(['leftPanel']);
    UI.setActiveLeftPanel('bookmarksPanel');
    UI.loadOutline();

    setOpenForm(false);
    setTitle('');
  };

  return (
    <>
      <div ref={viewerDiv} style={{ height: '100vh' }} />
      {openForm && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ marginBottom: 10 }}>Add Bookmark</h2>
            <label>Title:<br/>
              <input value={title} onChange={e => setTitle(e.target.value)} style={input} />
            </label>
            <br /><br />
            <label>Destination:<br/>
              <select value={destType} onChange={e => setDestType(e.target.value)} style={input}>
                <option value="page">Page</option>
                <option value="coords">Coordinates</option>
              </select>
            </label>
            <br /><br />
            {destType === 'page' ? (
              <label>Page Number:<br/>
                <input type="number" value={pageNum} onChange={e => setPageNum(e.target.value)} style={input} />
              </label>
            ) : (
              <>
                <label>X:<br/>
                  <input type="number" value={x} onChange={e => setX(e.target.value)} style={input} />
                </label><br /><br />
                <label>Y:<br/>
                  <input type="number" value={y} onChange={e => setY(e.target.value)} style={input} />
                </label>
              </>
            )}
            <br /><br />
            <button onClick={handleAddBookmark} style={buttonPrimary}>Add Bookmark</button>
            <button onClick={() => setOpenForm(false)} style={buttonSecondary}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

const overlay = {
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 9999
};

const modal = {
  background: '#fff',
  padding: '20px 30px',
  borderRadius: 10,
  width: 320,
  boxShadow: '0 0 20px rgba(0,0,0,0.2)',
  fontFamily: 'sans-serif'
};

const input = {
  width: '100%',
  padding: '6px',
  fontSize: '14px',
  marginTop: '4px'
};

const buttonPrimary = {
  marginTop: 10,
  padding: '8px 16px',
  background: '#0061f2',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  marginRight: 10,
  cursor: 'pointer'
};

const buttonSecondary = {
  marginTop: 10,
  padding: '8px 16px',
  background: '#ddd',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer'
};

export default App;
