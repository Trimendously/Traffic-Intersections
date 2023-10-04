const stripes = document.getElementById('stripes');
const v_stripes = document.getElementById('v_stripes');
const width = stripes.offsetWidth;
const height = stripes.offsetWidth;

function generateStripesPattern() {
    let h_pattern = 'white 0, white 10vw,';
    for (let i = 0; i < Math.floor(width/500); i++) 
    {
        if (i % 2 === 0) 
            h_pattern += 'transparent 10vw, transparent 20vw, ';
            
        else 
            h_pattern += 'white 0, white 10vw, ';
    }

    let v_pattern = 'white 0, white 10vh,';
    for (let i = 0; i < Math.floor(height/500); i++) 
    {
        if (i % 2 === 0) 
            v_pattern += 'transparent 10vh, transparent 20vh, ';
            
        else 
            v_pattern += 'white 0, white 10vh, ';
    }


    
    h_pattern = h_pattern.slice(0, -2); // Removes the trailing comma and space
    v_pattern = v_pattern.slice(0, -2); // Removes the trailing comma and space
    
    stripes.style.background = `repeating-linear-gradient(to right, ${h_pattern})`;
    v_stripes.style.background = `repeating-linear-gradient(${v_pattern})`;
}

window.addEventListener('resize', generateStripesPattern);
generateStripesPattern(); // Generate the pattern initially
