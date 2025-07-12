export default function GoogleBookFetcher(props) {
    console.log('GoogleBookFetcher component loaded');
    const { value, onChange } = props;
  
    const handleBlur = () => {
      console.log('handleBlur triggered, current value:', value);
      // (for now, comment out the fetch call)
      // fetchBookData(value)
    };
  
    const handleButtonClick = () => {
      console.log('Fetch button clicked, current value:', value);
      // (for now, comment out the fetch call)
      // fetchBookData(value)
    };
  
    return (
      <div>
        <h2 style={{ color: 'blue' }}>DEBUG: GoogleBookFetcher is rendering</h2>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            console.log('Input changed:', e.target.value);
            onChange(PatchEvent.from(set(e.target.value)));
          }}
          onBlur={handleBlur}
          placeholder="Enter Google Book ID or URL"
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          type="button"
          onClick={handleButtonClick}
          style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
        >
          Debug Fetch
        </button>
      </div>
    );
  }
  