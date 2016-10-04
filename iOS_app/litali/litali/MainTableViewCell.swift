//
//  MainTableViewCell.swift
//  litali
//
//  Created by Yemi Arogunmati on 9/18/16.
//  Copyright © 2016 Zyn LLC. All rights reserved.
//

import UIKit

class MainTableViewCell: UITableViewCell {

    @IBOutlet weak var mTextView: UITextView!
    
    @IBOutlet weak var mLabelView: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

}
